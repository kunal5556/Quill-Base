const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Post = require("../models/Post");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const cloudinaryService = require("../utils/cloudinaryService");
const escapeRegex = require("../utils/escapeRegex");
const sanitizeContent = require("../utils/sanitizeContent");
const sendResponse = require("../utils/sendResponse");

const listFields = "title slug excerpt coverImage category author status publishedAt likeCount commentCount createdAt";

const sortOptions = {
  newest: { publishedAt: -1 },
  oldest: { publishedAt: 1 },
  popular: { likeCount: -1 },
};

const buildSearchFilter = (search) => {
  const pattern = new RegExp(escapeRegex(search), "i");

  return { $or: [{ title: pattern }, { excerpt: pattern }] };
};

const buildExcerpt = (content) => {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > 150 ? `${plainText.slice(0, 150)}...` : plainText;
};

const applyStatus = (post, status) => {
  post.status = status;

  if (status === "published" && !post.publishedAt) {
    post.publishedAt = Date.now();
  }
};

const findCategoryOrFail = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

const findPostOrFail = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, category, search, sort } = req.query;

  const filter = { status: "published" };

  if (category) {
    const foundCategory = await Category.findOne({ slug: category });

    if (!foundCategory) {
      throw new ApiError(404, "Category not found");
    }

    filter.category = foundCategory._id;
  }

  if (search) {
    Object.assign(filter, buildSearchFilter(search));
  }

  const total = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .select(listFields)
    .sort(sortOptions[sort])
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name");

  sendResponse(res, 200, posts, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: "published" })
    .populate("category", "name slug")
    .populate("author", "name")
    .lean();

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = req.user ? Boolean(await Like.exists({ post: post._id, user: req.user._id })) : false;

  sendResponse(res, 200, { ...post, isLiked });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, status, coverImage } = req.body;

  await findCategoryOrFail(category);

  const sanitizedContent = sanitizeContent(content);

  const post = new Post({
    title,
    excerpt: excerpt || buildExcerpt(sanitizedContent),
    content: sanitizedContent,
    category,
    coverImage,
    author: req.user._id,
  });

  applyStatus(post, status);
  await post.save();

  sendResponse(res, 201, post);
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, status, coverImage } = req.body;

  const post = await findPostOrFail(req.params.id);
  const previousImageId = post.coverImage.publicId;

  if (category) {
    await findCategoryOrFail(category);
    post.category = category;
  }

  if (title) {
    post.title = title;
  }

  if (content) {
    post.content = sanitizeContent(content);
  }

  if (excerpt !== undefined) {
    post.excerpt = excerpt || buildExcerpt(post.content);
  }

  if (coverImage) {
    post.coverImage = coverImage;
  }

  if (status) {
    applyStatus(post, status);
  }

  await post.save();

  if (previousImageId && previousImageId !== post.coverImage.publicId) {
    await cloudinaryService.deleteImage(previousImageId);
  }

  sendResponse(res, 200, post);
});

const updatePostStatus = asyncHandler(async (req, res) => {
  const post = await findPostOrFail(req.params.id);

  applyStatus(post, req.body.status);
  await post.save();

  sendResponse(res, 200, post);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await findPostOrFail(req.params.id);

  await Comment.deleteMany({ post: post._id });
  await Like.deleteMany({ post: post._id });
  await post.deleteOne();
  await cloudinaryService.deleteImage(post.coverImage.publicId);

  sendResponse(res, 200, { message: "Post deleted" });
});

const getAdminPosts = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    Object.assign(filter, buildSearchFilter(search));
  }

  const total = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .select(listFields)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name");

  sendResponse(res, 200, posts, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const getAdminPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category", "name slug")
    .populate("author", "name");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  sendResponse(res, 200, post);
});

const getAdminStats = asyncHandler(async (req, res) => {
  const [totalPosts, publishedPosts, totalCategories, totalComments, totalUsers] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Category.countDocuments(),
    Comment.countDocuments(),
    User.countDocuments(),
  ]);

  const recentPosts = await Post.find()
    .select(listFields)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("category", "name slug");

  sendResponse(res, 200, {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalCategories,
    totalComments,
    totalUsers,
    recentPosts,
  });
});

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  getAdminPosts,
  getAdminPostById,
  getAdminStats,
};

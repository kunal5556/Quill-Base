const Comment = require("../models/Comment");
const Post = require("../models/Post");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");
const findPublishedPost = require("../utils/findPublishedPost");
const sendResponse = require("../utils/sendResponse");

const findCommentOrFail = async (commentId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  return comment;
};

const getPostComments = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const post = await findPublishedPost(req.params.postId);

  const total = await Comment.countDocuments({ post: post._id });

  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "name");

  sendResponse(res, 200, comments, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const createComment = asyncHandler(async (req, res) => {
  const post = await findPublishedPost(req.params.postId);

  const comment = await Comment.create({
    post: post._id,
    user: req.user._id,
    content: req.body.content,
  });

  await Post.updateOne({ _id: post._id }, { $inc: { commentCount: 1 } });
  await comment.populate("user", "name");

  sendResponse(res, 201, comment);
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await findCommentOrFail(req.params.id);

  if (!comment.user.equals(req.user._id)) {
    throw new ApiError(403, "You can only edit your own comment");
  }

  comment.content = req.body.content;
  await comment.save();
  await comment.populate("user", "name");

  sendResponse(res, 200, comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await findCommentOrFail(req.params.id);

  if (!comment.user.equals(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own comment");
  }

  await comment.deleteOne();
  await Post.updateOne({ _id: comment.post, commentCount: { $gt: 0 } }, { $inc: { commentCount: -1 } });

  sendResponse(res, 200, { message: "Comment deleted" });
});

const getAllComments = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;

  const filter = {};

  if (search) {
    filter.content = new RegExp(escapeRegex(search), "i");
  }

  const total = await Comment.countDocuments(filter);

  const comments = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("post", "title slug")
    .populate("user", "name");

  sendResponse(res, 200, comments, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

module.exports = {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
};

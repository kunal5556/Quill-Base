const Like = require("../models/Like");
const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");
const findPublishedPost = require("../utils/findPublishedPost");
const sendResponse = require("../utils/sendResponse");

const likePost = asyncHandler(async (req, res) => {
  const post = await findPublishedPost(req.params.postId);

  let likeCount = post.likeCount;

  try {
    await Like.create({ post: post._id, user: req.user._id });

    const updatedPost = await Post.findByIdAndUpdate(post._id, { $inc: { likeCount: 1 } }, { returnDocument: "after" });
    likeCount = updatedPost.likeCount;
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }
  }

  sendResponse(res, 200, { liked: true, likeCount });
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await findPublishedPost(req.params.postId);

  const removedLike = await Like.findOneAndDelete({ post: post._id, user: req.user._id });

  let likeCount = post.likeCount;

  if (removedLike) {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post._id, likeCount: { $gt: 0 } },
      { $inc: { likeCount: -1 } },
      { returnDocument: "after" }
    );

    if (updatedPost) {
      likeCount = updatedPost.likeCount;
    }
  }

  sendResponse(res, 200, { liked: false, likeCount });
});

module.exports = { likePost, unlikePost };

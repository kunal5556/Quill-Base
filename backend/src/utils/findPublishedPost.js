const Post = require("../models/Post");
const ApiError = require("./ApiError");

const findPublishedPost = async (postId) => {
  const post = await Post.findOne({ _id: postId, status: "published" });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

module.exports = findPublishedPost;

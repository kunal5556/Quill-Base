const express = require("express");
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
} = require("../controllers/postController");
const { getPostComments, createComment } = require("../controllers/commentController");
const { likePost, unlikePost } = require("../controllers/likeController");
const { protect, adminOnly, optionalAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamSchema } = require("../validations/commonValidation");
const { createCommentSchema, commentListQuerySchema } = require("../validations/commentValidation");
const {
  createPostSchema,
  updatePostSchema,
  statusSchema,
  listQuerySchema,
} = require("../validations/postValidation");

const router = express.Router();

router.get("/", validate(listQuerySchema, "query"), getPosts);
router.get("/:slug", optionalAuth, getPostBySlug);

router.post("/", protect, adminOnly, validate(createPostSchema), createPost);

router.put(
  "/:id",
  protect,
  adminOnly,
  validate(idParamSchema, "params"),
  validate(updatePostSchema),
  updatePost
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  validate(idParamSchema, "params"),
  validate(statusSchema),
  updatePostStatus
);

router.delete("/:id", protect, adminOnly, validate(idParamSchema, "params"), deletePost);

router.get("/:postId/comments", validate(commentListQuerySchema, "query"), getPostComments);
router.post("/:postId/comments", protect, validate(createCommentSchema), createComment);

router.post("/:postId/like", protect, likePost);
router.delete("/:postId/like", protect, unlikePost);

module.exports = router;

const express = require("express");
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
} = require("../controllers/postController");
const { protect, adminOnly, optionalAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamSchema } = require("../validations/commonValidation");
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

module.exports = router;

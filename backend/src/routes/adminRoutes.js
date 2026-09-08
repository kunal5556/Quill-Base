const express = require("express");
const { getAllComments } = require("../controllers/commentController");
const { getAdminPosts, getAdminPostById, getAdminStats } = require("../controllers/postController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamSchema } = require("../validations/commonValidation");
const { adminCommentListQuerySchema } = require("../validations/commentValidation");
const { adminListQuerySchema } = require("../validations/postValidation");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/posts", validate(adminListQuerySchema, "query"), getAdminPosts);
router.get("/posts/:id", validate(idParamSchema, "params"), getAdminPostById);
router.get("/comments", validate(adminCommentListQuerySchema, "query"), getAllComments);

module.exports = router;

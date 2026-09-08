const express = require("express");
const { updateComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamSchema } = require("../validations/commonValidation");
const { updateCommentSchema } = require("../validations/commentValidation");

const router = express.Router();

router.put("/:id", protect, validate(idParamSchema, "params"), validate(updateCommentSchema), updateComment);
router.delete("/:id", protect, validate(idParamSchema, "params"), deleteComment);

module.exports = router;

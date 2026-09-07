const express = require("express");
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { idParamSchema } = require("../validations/commonValidation");
const { createCategorySchema, updateCategorySchema } = require("../validations/categoryValidation");

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

router.post("/", protect, adminOnly, validate(createCategorySchema), createCategory);

router.put(
  "/:id",
  protect,
  adminOnly,
  validate(idParamSchema, "params"),
  validate(updateCategorySchema),
  updateCategory
);

router.delete("/:id", protect, adminOnly, validate(idParamSchema, "params"), deleteCategory);

module.exports = router;

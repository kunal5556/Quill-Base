const Category = require("../models/Category");
const Post = require("../models/Post");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  const publishedCounts = await Post.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$category", total: { $sum: 1 } } },
  ]);

  const countByCategory = {};

  publishedCounts.forEach((item) => {
    countByCategory[item._id] = item.total;
  });

  const categoriesWithCount = categories.map((category) => ({
    ...category,
    postCount: countByCategory[category._id] || 0,
  }));

  sendResponse(res, 200, categoriesWithCount);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const postCount = await Post.countDocuments({ category: category._id, status: "published" });

  sendResponse(res, 200, { ...category, postCount });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(409, "A category with this name already exists");
  }

  const category = await Category.create({ name, description });

  sendResponse(res, 201, category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({ name, _id: { $ne: category._id } });

    if (existingCategory) {
      throw new ApiError(409, "A category with this name already exists");
    }

    category.name = name;
  }

  if (description !== undefined) {
    category.description = description;
  }

  await category.save();

  sendResponse(res, 200, category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const postCount = await Post.countDocuments({ category: category._id });

  if (postCount > 0) {
    throw new ApiError(400, `Cannot delete: ${postCount} post(s) still use this category`);
  }

  await category.deleteOne();

  sendResponse(res, 200, { message: "Category deleted" });
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

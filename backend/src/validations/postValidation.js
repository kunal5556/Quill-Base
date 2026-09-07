const Joi = require("joi");
const { objectId } = require("./commonValidation");

const title = Joi.string().trim().min(3).max(150).messages({
  "string.empty": "Title is required",
  "string.min": "Title must be at least 3 characters",
  "string.max": "Title cannot be more than 150 characters",
});

const excerpt = Joi.string().trim().max(300).allow("").messages({
  "string.max": "Excerpt cannot be more than 300 characters",
});

const content = Joi.string().trim().max(50000).messages({
  "string.empty": "Content is required",
  "string.max": "Content is too long",
});

const status = Joi.string().valid("draft", "published").messages({
  "any.only": "Status must be either draft or published",
});

const coverImage = Joi.object({
  url: Joi.string().trim().uri().allow("").required(),
  publicId: Joi.string().trim().allow("").required(),
});

const category = objectId.messages({
  "string.empty": "Category is required",
  "string.pattern.base": "Invalid category id",
});

const page = Joi.number().integer().min(1).default(1);
const search = Joi.string().trim().max(100).allow("");

const createPostSchema = Joi.object({
  title: title.required(),
  excerpt,
  content: content.required(),
  category: category.required(),
  status: status.default("draft"),
  coverImage,
});

const updatePostSchema = Joi.object({
  title,
  excerpt,
  content,
  category,
  status,
  coverImage,
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update",
  });

const statusSchema = Joi.object({
  status: status.required(),
});

const listQuerySchema = Joi.object({
  page,
  limit: Joi.number().integer().min(1).max(50).default(9),
  category: Joi.string().trim(),
  search,
  sort: Joi.string().valid("newest", "oldest", "popular").default("newest"),
});

const adminListQuerySchema = Joi.object({
  page,
  limit: Joi.number().integer().min(1).max(50).default(10),
  status,
  search,
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  statusSchema,
  listQuerySchema,
  adminListQuerySchema,
};

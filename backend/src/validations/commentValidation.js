const Joi = require("joi");

const content = Joi.string().trim().min(1).max(1000).required().messages({
  "string.empty": "Comment cannot be empty",
  "string.max": "Comment cannot be more than 1000 characters",
});

const page = Joi.number().integer().min(1).default(1);
const limit = Joi.number().integer().min(1).max(50).default(10);

const createCommentSchema = Joi.object({ content });

const updateCommentSchema = Joi.object({ content });

const commentListQuerySchema = Joi.object({ page, limit });

const adminCommentListQuerySchema = Joi.object({
  page,
  limit,
  search: Joi.string().trim().max(100).allow(""),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  commentListQuerySchema,
  adminCommentListQuerySchema,
};

const Joi = require("joi");

const name = Joi.string().trim().min(2).max(50).messages({
  "string.empty": "Category name is required",
  "string.min": "Category name must be at least 2 characters",
  "string.max": "Category name cannot be more than 50 characters",
});

const description = Joi.string().trim().max(200).allow("").messages({
  "string.max": "Description cannot be more than 200 characters",
});

const createCategorySchema = Joi.object({
  name: name.required(),
  description,
});

const updateCategorySchema = Joi.object({
  name,
  description,
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update",
  });

module.exports = { createCategorySchema, updateCategorySchema };

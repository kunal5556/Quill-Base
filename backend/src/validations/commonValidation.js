const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid id",
  });

const idParamSchema = Joi.object({
  id: objectId.required(),
});

module.exports = { objectId, idParamSchema };

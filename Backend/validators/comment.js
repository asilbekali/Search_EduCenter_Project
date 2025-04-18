const Joi = require("joi");

const commentValidation = Joi.object({
  text: Joi.string().required(),
  star: Joi.number().integer().min(1).max(5).required(),
  edu_id: Joi.number().required(),
});

const commentUpdateValidation = Joi.object({
  text: Joi.string().required(),
  star: Joi.number().integer().min(1).max(5).required(),
});

module.exports = { commentValidation, commentUpdateValidation };

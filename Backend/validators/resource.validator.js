const Joi = require("joi");

const resourceValidator = Joi.object({
  image: Joi.string(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  file: Joi.string(),
  link: Joi.string(),
  category_id: Joi.number().required(),
});

const resourceUpdateValidator = Joi.object({
  image: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  file: Joi.string(),
  link: Joi.string(),
  category_id: Joi.number(),
});

module.exports = { resourceValidator, resourceUpdateValidator };

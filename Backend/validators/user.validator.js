const Joi = require("joi");

const userValidator = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  region_id: Joi.number().required(),
  role: Joi.string().required(),
  image: Joi.string(),
});

module.exports = userValidator;

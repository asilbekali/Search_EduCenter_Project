const Joi = require("joi");

const branchValidator = Joi.object({
  image: Joi.string(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  region_id: Joi.number().required(),
  edu_id: Joi.number().required(),
});

const branchUpdateValidation = Joi.object({
  image: Joi.string(),
  name: Joi.string(),
  phone: Joi.string(),
  address: Joi.string(),
  region_id: Joi.number(),
  edu_id: Joi.number(),
});

module.exports = { branchValidator, branchUpdateValidation };

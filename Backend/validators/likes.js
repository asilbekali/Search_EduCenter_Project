const Joi = require("joi");

const likeValidation = Joi.object({
  edu_id: Joi.number().required(),
});

module.exports = likeValidation;

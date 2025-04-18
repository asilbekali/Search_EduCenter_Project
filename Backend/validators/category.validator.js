const Joi = require("joi");

const categoryValidator = Joi.object({
  name: Joi.string().required(),
});

module.exports = categoryValidator;

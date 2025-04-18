const Joi = require("joi");

const resetPasswordValidator = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

module.exports = resetPasswordValidator;

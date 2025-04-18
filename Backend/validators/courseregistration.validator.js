const Joi = require("joi");

const courseRegistrationValidator = Joi.object({
  branch_id: Joi.number().required(),
});

const courseRegistrationValidatorPatch = Joi.object({
  branch_id: Joi.number(),
});

module.exports = {
  courseRegistrationValidator,
  courseRegistrationValidatorPatch,
};

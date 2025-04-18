const joi = require("joi");

function validEdu(data) {
  return joi
    .object({
      name: joi.string().min(2).max(50).required(),
      image: joi.string(),
      region_id: joi.number().integer().required(),
      location: joi.string().min(5).max(100).required(),
      subjects: joi.array().min(1).required(),
      fields: joi.array().min(1).required(),
      phone: joi
        .string()
        .pattern(/^\+998[0-9]{9}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Phone number must start with +998 and be 12 digits long.",
        }),
    })
    .validate(data, { abortEarly: true });
}

function validEduUpdate(data) {
  return joi
    .object({
      name: joi.string().min(2).max(50),
      image: joi.string(),
      region_id: joi.number().integer(),
      location: joi.string().min(5).max(100),
      subjects: joi.array().min(1),
      fields: joi.array().min(1),
      phone: joi
        .string()
        .pattern(/^\+998[0-9]{9}$/)
        
        .messages({
          "string.pattern.base":
            "Phone number must start with +998 and be 12 digits long.",
        }),
    })
    .validate(data, { abortEarly: true });
}

module.exports = { validEdu, validEduUpdate };

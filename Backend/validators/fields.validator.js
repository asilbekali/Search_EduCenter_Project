const joi = require("joi");

function validateFileds(data) {
    return joi
        .object({
            name: joi.string().min(2).max(50).required(),
            image: joi.string().min(2).max(50),
        })
        .validate(data, { abortEarly: true });
}

module.exports = { validateFileds };

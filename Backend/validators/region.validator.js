const joi = require("joi");

function validateRegion(data) {
    return joi
        .object({name: joi.string().required()})
        .validate(data, { abortEarly: true });
}

module.exports = { validateRegion };

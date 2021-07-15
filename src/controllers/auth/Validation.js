const Joi = require('joi');

const LoginSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

const SignupSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
})

module.exports = {
    LoginSchema,
    SignupSchema
}
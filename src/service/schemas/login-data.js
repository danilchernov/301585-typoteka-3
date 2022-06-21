"use strict";

const Joi = require(`joi`);
const { User, UserMessage } = require(`../../constants`);

module.exports = Joi.object({
  email: Joi.string().email().empty(``).required().messages({
    "string.email": UserMessage.EMAIL_STRING,
    "any.required": UserMessage.EMAIL_REQUIRED,
  }),
  password: Joi.string()
    .min(User.PASSWORD_MIN_LENGTH)
    .empty(``)
    .required()
    .messages({
      "string.min": UserMessage.PASSWORD_MIN_LENGTH,
      "any.required": UserMessage.PASSWORD_REQUIRED,
    }),
});

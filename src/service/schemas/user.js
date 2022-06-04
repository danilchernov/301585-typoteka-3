"use strict";

const Joi = require(`joi`);
const { User, UserMessage } = require(`../../constants`);

module.exports = Joi.object({
  firstName: Joi.string()
    .regex(User.FIRST_NAME_REGEX)
    .empty(``)
    .required()
    .messages({
      "string.pattern.base": UserMessage.FIRST_NAME_BASE,
      "any.required": UserMessage.FIRST_NAME_REQUIRED,
    }),
  lastName: Joi.string()
    .regex(User.FIRST_NAME_REGEX)
    .empty(``)
    .required()
    .messages({
      "string.pattern.base": UserMessage.LAST_NAME_BASE,
      "any.required": UserMessage.LAST_NAME_REQUIRED,
    }),
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
  repeatedPassword: Joi.string()
    .valid(Joi.ref(`password`))
    .min(User.PASSWORD_MIN_LENGTH)
    .empty(``)
    .required()
    .messages({
      "string.min": UserMessage.PASSWORD_MIN_LENGTH,
      "any.required": UserMessage.PASSWORD_REQUIRED,
      "any.only": UserMessage.PASSWORD_ONLY,
    }),
  avatar: Joi.string().empty(``),
});

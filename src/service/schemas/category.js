"use strict";

const Joi = require(`joi`);
const { Category, CategoryMessage } = require(`../../constants`);

module.exports = Joi.object({
  name: Joi.string()
    .min(Category.NAME_MIN_LENGTH)
    .max(Category.NAME_MAX_LENGTH)
    .empty(``)
    .required()
    .messages({
      "string.min": CategoryMessage.NAME_MIN_LENGTH,
      "string.max": CategoryMessage.NAME_MAX_LENGTH,
      "any.required": CategoryMessage.REQUIRED,
    }),
});

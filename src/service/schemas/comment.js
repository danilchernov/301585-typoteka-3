"use strict";

const Joi = require(`joi`);
const { Comment, CommentMessage } = require(`../../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .min(Comment.TEXT_MIN_LENGTH)
    .max(Comment.TEXT_MAX_LENGTH)
    .required()
    .messages({
      "string.min": CommentMessage.TEXT_MIN_LENGTH,
      "string.max": CommentMessage.TEXT_MAX_LENGTH,
      "any.required": CommentMessage.REQUIRED,
    }),
});

"use strict";

const Joi = require(`joi`);
const { RouteParameter, RouteParameterMessage } = require(`../../constants`);

module.exports = Joi.object({
  categoryId: Joi.number()
    .integer()
    .min(RouteParameter.CATEGORY_ID_MIN)
    .messages({
      "number.base": RouteParameterMessage.CATEGORY_ID_BASE,
      "number.min": RouteParameterMessage.CATEGORY_ID_MIN,
      "number.integer": RouteParameterMessage.CATEGORY_ID_INTEGER,
    }),
  articleId: Joi.number()
    .integer()
    .min(RouteParameter.ARTICLE_ID_MIN)
    .messages({
      "number.base": RouteParameterMessage.ARTICLE_ID_BASE,
      "number.min": RouteParameterMessage.ARTICLE_ID_MIN,
      "number.integer": RouteParameterMessage.ARTICLE_ID_INTEGER,
    }),
  commentId: Joi.number()
    .integer()
    .min(RouteParameter.COMMENT_ID_MIN)
    .messages({
      "number.base": RouteParameterMessage.COMMENT_ID_BASE,
      "number.min": RouteParameterMessage.COMMENT_ID_MIN,
      "number.integer": RouteParameterMessage.COMMENT_ID_INTEGER,
    }),
});

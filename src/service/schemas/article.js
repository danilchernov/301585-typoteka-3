"use strict";

const Joi = require(`joi`);
const { Article, ArticleMessage } = require(`../../constants`);

module.exports = (categories) =>
  Joi.object({
    title: Joi.string()
      .min(Article.TITLE_MIN_LENGTH)
      .max(Article.TITLE_MAX_LENGTH)
      .required()
      .messages({
        "string.min": ArticleMessage.TITLE_MIN_LENGTH,
        "string.max": ArticleMessage.TITLE_MAX_LENGTH,
        "any.required": ArticleMessage.TITLE_REQUIRED,
      }),
    announce: Joi.string()
      .min(Article.ANNOUNCE_MIN_LENGTH)
      .max(Article.ANNOUNCE_MAX_LENGTH)
      .required()
      .messages({
        "string.min": ArticleMessage.ANNOUNCE_MIN_LENGTH,
        "string.max": ArticleMessage.ANNOUNCE_MAX_LENGTH,
        "any.required": ArticleMessage.ANNOUNCE_REQUIRED,
      }),
    fullText: Joi.string()
      .max(Article.FULL_TEXT_MAX_LENGTH)
      .messages({ "string.max": ArticleMessage.FULL_TEXT_MAX_LENGTH }),
    image: Joi.string(),
    categories: Joi.array()
      .items(Joi.number().valid(...categories))
      .min(Article.CATEGORIES_MIN_LENGTH)
      .required()
      .messages({
        "array.base": ArticleMessage.CATEGORIES_BASE,
        "array.min": ArticleMessage.CATEGORIES_MIN_LENGTH,
        "any.only": ArticleMessage.СATEGORIES_ONLY,
        "any.required": ArticleMessage.CATEGORIES_MIN_LENGTH,
      }),
    date: Joi.string().isoDate().required().messages({
      "string.isoDate": ArticleMessage.DATE_ISO_DATE,
      "any.required": ArticleMessage.DATE_REQUIRED,
    }),
  });

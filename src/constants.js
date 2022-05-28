"use strict";

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
  TEST: `test`,
};

module.exports.ExitCode = {
  SUCCESS: 0,
  UNCAUGHT_FATAL_EXCEPTION: 1,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Article = {
  TITLE_MIN_LENGTH: 30,
  TITLE_MAX_LENGTH: 250,
  ANNOUNCE_MIN_LENGTH: 30,
  ANNOUNCE_MAX_LENGTH: 250,
  FULL_TEXT_MAX_LENGTH: 1000,
  CATEGORIES_MIN_LENGTH: 1,
};

module.exports.ArticleMessage = {
  TITLE_MIN_LENGTH: `Заголовок содержит меньше ${module.exports.Article.TITLE_MIN_LENGTH} символов`,
  TITLE_MAX_LENGTH: `Заголовок не может содержать более ${module.exports.Article.TITLE_MAX_LENGTH} символов`,
  TITLE_REQUIRED: `Заголовок публикации не может быть пустым`,
  ANNOUNCE_MIN_LENGTH: `Анонс содержит меньше ${module.exports.Article.ANNOUNCE_MIN_LENGTH} символов`,
  ANNOUNCE_MAX_LENGTH: `Анонс не может содержать более ${module.exports.Article.ANNOUNCE_MAX_LENGTH} символов`,
  ANNOUNCE_REQUIRED: `Анонс публикации не может быть пустым`,
  FULL_TEXT_MAX_LENGTH: `Полный текст публикации не может содержать более ${module.exports.Article.FULL_TEXT_MAX_LENGTH} символов`,
  CATEGORIES_BASE: `Значение не относится к типу массива или не может быть приведено к массиву из строки`,
  CATEGORIES_MIN_LENGTH: `У публикации должна быть выбрана хотя бы ${module.exports.Article.CATEGORIES_MIN_LENGTH} категория`,
  CATEGORIES_ONLY: `Указана несуществующая категория`,
  DATE_ISO_DATE: `Строка не является допустимой строкой даты ISO`,
  DATE_REQUIRED: `Укажите дату`,
};

module.exports.Comment = {
  TEXT_MIN_LENGTH: 20,
  TEXT_MAX_LENGTH: 100,
};

module.exports.CommentMessage = {
  TEXT_MIN_LENGTH: `Текст комментария должен быть не меньше ${module.exports.Comment.TEXT_MIN_LENGTH} символов`,
  TEXT_MAX_LENGTH: `Текст объявления должен быть не больше ${module.exports.Comment.TEXT_MAX_LENGTH} символов`,
  REQUIRED: `Текст комментария не может быть пустым`,
};

module.exports.RouteParameter = {
  ARTICLE_ID_MIN: 1,
  COMMENT_ID_MIN: 1,
};
module.exports.RouteParameterMessage = {
  ARTICLE_ID_BASE: `Идентификатор ресурса должен быть натуральным числом`,
  ARTICLE_ID_MIN: `Идентификатор ресурса должен быть больше нуля`,
  ARTICLE_ID_INTEGER: `Идентификатор ресурса должен быть целым числом`,
  COMMENT_ID_BASE: `Идентификатор ресурса должен быть натуральным числом`,
  COMMENT_ID_MIN: `Идентификатор ресурса должен быть больше нуля`,
  COMMENT_ID_INTEGER: `Идентификатор ресурса должен быть целым числом`,
};

module.exports.API_PREFIX = `/api`;

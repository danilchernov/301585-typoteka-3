"use strict";

const { HttpCode, ArticleMessage } = require(`../../constants`);

module.exports = (service, logger) => async (req, res, next) => {
  const { articleId } = req.params;
  const { comments = false } = req.query;
  const article = await service.findOne(articleId, { comments });

  if (!article) {
    logger.error(
      `[${req.method}] Article with id "${articleId}" not found ${req.originalUrl}`
    );

    return res.status(HttpCode.NOT_FOUND).send({
      validationMessages: [ArticleMessage.NOT_EXISTS],
    });
  }

  res.locals.article = article;
  return next();
};

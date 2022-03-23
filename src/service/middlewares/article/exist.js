'use strict';

const {HTTP_CODE} = require(`../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await service.findOne(articleId);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Article with id "${articleId}" not found`);
  }

  res.locals.article = article;
  return next();
};

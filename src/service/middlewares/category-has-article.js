"use strict";

const { HttpCode, CategoryMessage } = require(`../../constants`);

module.exports = (categoryService, logger) => async (req, res, next) => {
  const { category } = res.locals;

  const hasArticle = await categoryService.hasArticle(category.id);

  if (hasArticle) {
    logger.error(`[${req.method}] Category with article can't be deleted`);

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ validationMessages: [CategoryMessage.HAS_ARTICLES] });
  }

  return next();
};

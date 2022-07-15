"use strict";

const { HttpCode, CategoryMessage } = require(`../../constants`);

module.exports = (categoryService, logger) => async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryService.findOne(categoryId);

  if (!category) {
    logger.error(
      `[${req.method}] Category with id "${categoryId}" not found ${req.originalUrl}`
    );

    return res.status(HttpCode.NOT_FOUND).send({
      validationMessages: [CategoryMessage.NOT_EXISTS],
    });
  }

  res.locals.category = category;

  return next();
};

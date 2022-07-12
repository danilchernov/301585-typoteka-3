"use strict";

const { HttpCode, CategoryMessage } = require(`../../constants`);

module.exports = (categoryService, logger) => async (req, res, next) => {
  const { name } = req.body;

  const isCategoryExists = await categoryService.findByName(name);

  if (isCategoryExists) {
    logger.error(`[${req.method}] Сategory with name "${name}" already exists`);

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ validationMessages: [CategoryMessage.NAME_UNIQUE] });
  }

  return next();
};

"use strict";

const { HttpCode } = require(`../../constants`);

module.exports =
  (schema, categoryService, logger) => async (req, res, next) => {
    const { body } = req;

    let validSchema = null;

    try {
      const categories = await categoryService.findAll();
      const categoriesIds = categories.reduce(
        (acc, item) => [item.id, ...acc],
        []
      );

      validSchema = schema(categoriesIds);
    } catch (err) {
      logger.error(err);

      return res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ error: [`Failed to check selected categories`] });
    }

    try {
      await validSchema.validateAsync(body, { abortEarly: false });
    } catch (err) {
      const { details } = err;
      logger.error(`Article data is not valid`);

      return res.status(HttpCode.BAD_REQUEST).json({
        validationMessages: details.map(
          (validationDescription) => validationDescription.message
        ),
      });
    }

    return next();
  };

"use strict";

const { HttpCode } = require(`../../constants`);

module.exports = (schema, logger) => async (req, res, next) => {
  const { params } = req;

  try {
    await schema.validateAsync(params, { abortEarly: false });
  } catch (err) {
    const { details } = err;
    logger.error(`Parameter is not valid`);

    return res.status(HttpCode.BAD_REQUEST).json({
      validationMessages: details.map(
        (validationDescription) => validationDescription.message
      ),
    });
  }

  return next();
};

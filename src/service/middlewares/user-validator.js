"use strict";

const { HttpCode } = require(`../../constants`);

module.exports = (schema, logger) => async (req, res, next) => {
  const { body } = req;

  try {
    await schema.validateAsync(body, { abortEarly: false });
  } catch (err) {
    const { details } = err;
    logger.error(`User data is not valid`);

    return res.status(HttpCode.BAD_REQUEST).json({
      validationMessages: details.map(
        (validationDescription) => validationDescription.message
      ),
    });
  }

  return next();
};

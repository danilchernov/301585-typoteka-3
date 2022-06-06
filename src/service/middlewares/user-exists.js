"use strict";

const { HttpCode, UserMessage } = require(`../../constants`);

module.exports = (service, logger) => async (req, res, next) => {
  const { email } = req.body;

  const isUserExists = await service.findByEmail(email);

  if (isUserExists) {
    logger.error(
      `[${req.method}] User with E-mail ${email} is already registered`
    );

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ errorMessages: [UserMessage.EMAIL_UNIQUE] });
  }

  return next();
};

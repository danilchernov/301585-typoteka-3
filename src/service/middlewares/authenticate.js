"use strict";

const { HttpCode, UserMessage } = require(`../../constants`);

module.exports = (service, logger) => async (req, res, next) => {
  const { email, password } = req.body;

  const registeredUser = await service.findByEmail(email);

  if (!registeredUser) {
    logger.error(`[${req.method}] User with E-mail ${email} is not registered`);

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ validationMessages: [UserMessage.EMAIL_NOT_EXIST] });
  }

  const isUserPasswordValid = await service.checkPassword(
    password,
    registeredUser.passwordHash
  );

  if (!isUserPasswordValid) {
    logger.error(
      `[${req.method}] User with E-mail ${email} entered an invalid password`
    );

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ validationMessages: [UserMessage.PASSWORD_INVALID] });
  }

  res.locals.user = registeredUser;

  return next();
};

"use strict";

const { Router } = require(`express`);
const { HttpCode, UserMessage } = require(`../../../constants`);

const userExists = require(`../../middlewares/user-exists`);
const userSchema = require(`../../schemas/user`);
const userValidator = require(`../../middlewares/user-validator`);

const loginSchema = require(`../../schemas/login`);
const loginValidator = require(`../../middlewares/login-validator`);

module.exports = (api, service, logger) => {
  const route = new Router();

  const isUserExists = userExists(service, logger);
  const isUserValid = userValidator(userSchema, logger);
  const isLoginValid = loginValidator(loginSchema, logger);

  api.use(`/user`, route);

  route.post(`/`, [isUserValid, isUserExists], async (req, res) => {
    const user = await service.create(req.body);
    return res.status(HttpCode.CREATED).json(user);
  });

  route.post(`/login`, isLoginValid, async (req, res) => {
    const { email, password } = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .send(UserMessage.EMAIL_NOT_EXIST);
    }

    const isPasswordCorrect = await service.checkPassword(
      password,
      user.passwordHash
    );

    if (isPasswordCorrect) {
      delete user.passwordHash;
      return res.status(HttpCode.OK).json(user);
    } else {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .send(UserMessage.PASSWORD_INVALID);
    }
  });
};

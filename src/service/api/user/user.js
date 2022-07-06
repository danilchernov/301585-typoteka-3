"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const jwtUtils = require(`../../../lib/jwt`);

const userExists = require(`../../middlewares/user-exists`);
const userSchema = require(`../../schemas/user`);
const userValidator = require(`../../middlewares/user-validator`);

const loginDataSchema = require(`../../schemas/login-data`);
const loginDataValidator = require(`../../middlewares/login-data-validator`);

const authenticate = require(`../../middlewares/authenticate`);

module.exports = ({ app, userService, logger } = {}) => {
  const route = new Router();

  const isUserExists = userExists(userService, logger);
  const isUserValid = userValidator(userSchema, logger);
  const isLoginDataValid = loginDataValidator(loginDataSchema, logger);
  const isUserAuthenticated = authenticate(userService, logger);

  app.use(`/user`, route);

  route.post(`/`, [isUserValid, isUserExists], async (req, res) => {
    const user = await userService.create(req.body);
    return res.status(HttpCode.CREATED).json(user);
  });

  route.post(`/login`, [isLoginDataValid, isUserAuthenticated], (req, res) => {
    const { user } = res.locals;

    const token = jwtUtils.generateAccessToken(user);

    return res.status(HttpCode.OK).json(token);
  });
};

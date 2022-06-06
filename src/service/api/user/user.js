"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);

const userExists = require(`../../middlewares/user-exists`);
const userSchema = require(`../../schemas/user`);
const userValidator = require(`../../middlewares/user-validator`);

module.exports = (api, service, logger) => {
  const route = new Router();

  const isUserExists = userExists(service, logger);
  const isUserValid = userValidator(userSchema, logger);

  api.use(`/user`, route);

  route.post(`/`, [isUserValid, isUserExists], async (req, res) => {
    const user = await service.create(req.body);
    return res.status(HttpCode.CREATED).json(user);
  });
};

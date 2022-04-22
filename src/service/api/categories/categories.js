"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const route = new Router();

module.exports = (api, service) => {
  api.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    return res.status(HttpCode.OK).json(categories);
  });
};

"use strict";

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const route = new Router();

module.exports = (api, service) => {
  api.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    return res.status(HTTP_CODE.OK).json(categories);
  });
};

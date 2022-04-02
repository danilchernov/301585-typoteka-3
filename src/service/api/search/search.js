"use strict";

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../../constants`);
const route = new Router();

module.exports = (api, service) => {
  api.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(HTTP_CODE.BAD_REQUEST).send(`Bad request`);
    }

    const articles = await service.findAll(query);

    return res.status(HTTP_CODE.OK).json(articles);
  });
};

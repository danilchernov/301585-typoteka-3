"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../../constants`);
const route = new Router();

module.exports = ({ app, searchService } = {}) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
    }

    const articles = await searchService.findAll(query);

    return res.status(HttpCode.OK).json(articles);
  });
};

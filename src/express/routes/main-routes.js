"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const mainRoutes = new Router();

const api = getApi();

mainRoutes.get(`/`, async (req, res, next) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles({ comments: true }),
      api.getCategories({ count: true }),
    ]);

    return res.render(`views/main/index`, { articles, categories });
  } catch (err) {
    return next(err);
  }
});

mainRoutes.get(`/register`, (req, res) => {
  return res.render(`views/main/register`);
});

mainRoutes.get(`/login`, (req, res) => {
  return res.render(`views/main/login`);
});

mainRoutes.get(`/search`, async (req, res) => {
  try {
    const { query } = req.query;
    const results = await api.search(query);
    res.render(`views/main/search`, { searchText: query, results });
  } catch (error) {
    res.render(`views/main/search`, { searchText: ``, results: [] });
  }
});

module.exports = mainRoutes;

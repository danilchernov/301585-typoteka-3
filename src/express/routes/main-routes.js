"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const mainRoutes = new Router();

const api = getApi();

const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res, next) => {
  let { page = 1 } = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [{ count, articles }, categories] = await Promise.all([
      api.getArticles({ comments: true, limit, offset }),
      api.getCategories({ count: true }),
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    return res.render(`views/main/index`, {
      articles,
      page,
      totalPages,
      categories,
    });
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

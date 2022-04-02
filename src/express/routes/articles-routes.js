"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const articlesRoutes = new Router();

const api = getApi();

articlesRoutes.get(`/category/:id`, (req, res) => {
  return res.render(`views/articles/articles-by-category`);
});

articlesRoutes.get(`/add`, (req, res) => {
  return res.render(`views/articles/editor`);
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const { id } = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);
  return res.render(`views/articles/editor`, { article, categories });
});

articlesRoutes.get(`/:id`, (req, res) => {
  return res.render(`views/articles/article`);
});

module.exports = articlesRoutes;

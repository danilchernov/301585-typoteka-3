"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const myRoutes = new Router();

const api = getApi();

myRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  return res.render(`views/my/index`, { articles });
});

myRoutes.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  return res.render(`views/my/comments`, { articles });
});

myRoutes.get(`/categories`, (req, res) => {
  return res.render(`views/my/categories`);
});

module.exports = myRoutes;

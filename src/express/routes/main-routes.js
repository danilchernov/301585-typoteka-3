"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const mainRoutes = new Router();

const api = getApi();

mainRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  return res.render(`views/main/index`, { articles });
});

mainRoutes.get(`/register`, (req, res) => {
  return res.render(`views/main/register`);
});

mainRoutes.get(`/login`, (req, res) => {
  return res.render(`views/main/login`);
});

mainRoutes.get(`/search`, (req, res) => {
  return res.render(`views/main/search`);
});

module.exports = mainRoutes;

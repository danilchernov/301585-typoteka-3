"use strict";

const { Router } = require(`express`);
const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => {
  return res.render(`views/my/index`);
});

myRoutes.get(`/comments`, (req, res) => {
  return res.render(`views/my/comments`);
});

myRoutes.get(`/categories`, (req, res) => {
  return res.render(`views/my/categories`);
});

module.exports = myRoutes;

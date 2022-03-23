"use strict";

const { Router } = require(`express`);
const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => {
  return res.render(`views/main/index`);
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

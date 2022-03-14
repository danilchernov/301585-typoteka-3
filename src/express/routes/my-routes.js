'use strict';

const {Router} = require(`express`);
const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.render(`views/my/index`));
myRoutes.get(`/comments`, (req, res) => res.render(`views/my/comments`));
myRoutes.get(`/categories`, (req, res) => res.render(`views/my/categories`));

module.exports = myRoutes;

'use strict';

const {Router} = require(`express`);
const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.send(`/my`));
myRoutes.get(`/comments`, (req, res) => res.send(`/my/comments`));
myRoutes.get(`/categories`, (req, res) => res.send(`/my/categories`));

module.exports = myRoutes;

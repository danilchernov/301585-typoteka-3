"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);

const isUserAdmin = require(`../middlewares/is-user-admin`);

const api = getApi();

const myRoutes = new Router();

myRoutes.use(isUserAdmin);

myRoutes.get(`/`, async (req, res, next) => {
  try {
    const articles = await api.getArticles();
    return res.render(`views/my/index`, { articles });
  } catch (err) {
    return next(err);
  }
});

myRoutes.get(`/articles/:articleId`, async (req, res, next) => {
  const { accessToken } = req.session;
  const { articleId } = req.params;

  try {
    await api.deleteArticle(articleId, accessToken);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

myRoutes.get(`/comments`, async (req, res, next) => {
  try {
    const comments = await api.getAllComments();
    return res.render(`views/my/comments`, { comments });
  } catch (err) {
    return next(err);
  }
});

myRoutes.get(`/comments/:articleId/:id`, async (req, res, next) => {
  const { accessToken } = req.session;
  const { articleId, id } = req.params;

  try {
    await api.deleteComment(id, articleId, accessToken);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

myRoutes.get(`/categories`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    return res.render(`views/my/categories`, { categories });
  } catch (err) {
    return next(err);
  }
});

module.exports = myRoutes;

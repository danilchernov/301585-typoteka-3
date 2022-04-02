"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const { upload } = require(`../middlewares/multer`);
const { ensureArray } = require(`../../utils`);
const articlesRoutes = new Router();

const api = getApi();

articlesRoutes.get(`/category/:id`, (req, res) => {
  return res.render(`views/articles/articles-by-category`);
});

articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  return res.render(`views/articles/editor`, { categories });
});

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  const { body, file } = req;

  const article = {
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdDate: body.date,
    category: ensureArray(body.category),
    image: file.filename,
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res, next) => {
  const { id } = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`views/articles/editor`, { article, categories });
  } catch (err) {
    return next(err);
  }
});

articlesRoutes.get(`/:id`, (req, res) => {
  return res.render(`views/articles/article`);
});

module.exports = articlesRoutes;

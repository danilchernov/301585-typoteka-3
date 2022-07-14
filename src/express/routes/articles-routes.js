"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);

const upload = require(`../middlewares/multer`);
const isUserLogged = require(`../middlewares/is-user-logged`);
const isUserAdmin = require(`../middlewares/is-user-admin`);

const { ensureArray } = require(`../../utils`);

const api = getApi();

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => {
  return res.render(`views/articles/articles-by-category`);
});

articlesRoutes.get(`/add`, isUserAdmin, async (req, res, next) => {
  const { article = null, validationMessages = null } = req.session;

  try {
    const categories = await api.getCategories();
    req.session.article = null;
    req.session.validationMessages = null;

    return res.render(`views/articles/editor`, {
      article,
      categories,
      validationMessages,
    });
  } catch (err) {
    return next();
  }
});

articlesRoutes.post(
  `/add`,
  [isUserAdmin, upload.single(`upload`)],
  async (req, res) => {
    const { body, file } = req;
    const { accessToken } = req.session;

    const article = {
      title: body.title,
      announce: body.announcement,
      fullText: body[`full-text`],
      date: body.date,
      categories: ensureArray(body.category),
      image: file ? file.filename : body.photo || ``,
    };

    try {
      await api.createArticle(article, accessToken);
      res.redirect(`/my`);
    } catch (err) {
      req.session.article = article;
      req.session.validationMessages = err.response.data.validationMessages;
      res.redirect(`back`);
    }
  }
);

articlesRoutes.get(`/edit/:id`, isUserAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { updatedArticle = null, validationMessages = null } = req.session;

  try {
    let [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);

    if (updatedArticle) {
      article = { ...article, id };

      const articleCategories = article.categories.map((category) =>
        category.id.toString()
      );

      article = { ...article, categories: articleCategories };
    }

    req.session.updatedArticle = null;
    req.session.validationMessages = null;
    return res.render(`views/articles/editor`, {
      article,
      categories,
      validationMessages,
    });
  } catch (err) {
    return next(err);
  }
});

articlesRoutes.post(
  `/edit/:id`,
  [isUserAdmin, upload.single(`upload`)],
  async (req, res) => {
    const { body, file } = req;
    const { id } = req.params;
    const { accessToken } = req.session;

    const article = {
      title: body.title,
      announce: body.announcement,
      fullText: body[`full-text`],
      date: body.date,
      categories: ensureArray(body.category),
      image: file ? file.filename : body.photo || ``,
    };

    try {
      await api.updateArticle(id, article, accessToken);
      return res.redirect(`/my`);
    } catch (err) {
      req.session.updatedArticle = article;
      req.session.validationMessages = err.response.data.validationMessages;

      return res.redirect(`/articles/edit/${id}`);
    }
  }
);

articlesRoutes.get(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  const { referer } = req.headers;
  const { validationMessages = null } = req.session;

  try {
    const [article, allCategories] = await Promise.all([
      api.getArticle(id, { comments: true }),
      api.getCategories({ count: true }),
    ]);

    const categories = allCategories.filter((category) => {
      return article.categories.some((item) => item.id === category.id);
    });

    req.session.validationMessages = null;

    return res.render(`views/articles/article`, {
      article,
      categories,
      validationMessages,
      referer,
    });
  } catch (err) {
    return next();
  }
});

articlesRoutes.post(
  `/:id`,
  [isUserLogged, upload.single(`upload`)],
  async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const { accessToken } = req.session;

    const comment = {
      text: body.message,
    };

    try {
      await api.createComment(id, comment, accessToken);
      return res.redirect(`back`);
    } catch (err) {
      req.session.validationMessages = err.response.data.validationMessages;
      return res.redirect(`back`);
    }
  }
);

module.exports = articlesRoutes;

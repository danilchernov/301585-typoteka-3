"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);
const { upload } = require(`../middlewares/multer`);

const mainRoutes = new Router();

const api = getApi();

const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res, next) => {
  let { page = 1 } = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [{ count, articles }, categories] = await Promise.all([
      api.getArticles({ comments: true, limit, offset }),
      api.getCategories({ count: true }),
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    return res.render(`views/main/index`, {
      articles,
      page,
      totalPages,
      categories,
    });
  } catch (err) {
    return next(err);
  }
});

mainRoutes.get(`/register`, (req, res) => {
  const { user = null, validationMessages = null } = req.session;

  req.session.user = null;
  req.session.errMessages = null;

  return res.render(`views/main/register`, { user, validationMessages });
});

mainRoutes.post(`/register`, upload.single(`upload`), async (req, res) => {
  const { body, file } = req;

  const user = {
    firstName: body.name,
    lastName: body.surname,
    email: body.email,
    password: body.password,
    repeatedPassword: body[`repeat-password`],
    avatar: file ? file.filename : ``,
  };

  try {
    await api.createUser(user);
    return res.redirect(`/login`);
  } catch (err) {
    req.session.user = user;
    req.session.validationMessages = err.response.data.validationMessages;

    return res.redirect(`/register`);
  }
});

mainRoutes.get(`/login`, (req, res) => {
  return res.render(`views/main/login`);
});

mainRoutes.get(`/search`, async (req, res) => {
  try {
    const { query } = req.query;
    const results = await api.search(query);
    res.render(`views/main/search`, { searchText: query, results });
  } catch (err) {
    res.render(`views/main/search`, { searchText: ``, results: [] });
  }
});

module.exports = mainRoutes;

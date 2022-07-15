"use strict";

const { Router } = require(`express`);
const { getApi } = require(`../api`);

const { ARTICLES_PER_PAGE } = require(`../../constants`);
const jwtUtls = require(`../../lib/jwt`);

const upload = require(`../middlewares/multer`);
const csrfProtection = require(`../middlewares/csrf-protection`);

const api = getApi();

const mainRoutes = new Router();

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

    const data = {
      articles,
      page,
      totalPages,
      categories,
    };

    return articles.length
      ? res.render(`views/main/main`, data)
      : res.render(`views/main/main-empty`);
  } catch (err) {
    return next(err);
  }
});

mainRoutes.get(`/register`, csrfProtection, (req, res) => {
  const { user = null, validationMessages = null } = req.session;
  const csrfToken = req.csrfToken();

  req.session.user = null;
  req.session.validationMessages = null;

  const data = {
    user,
    validationMessages,
    csrfToken,
  };

  return res.render(`views/main/register`, data);
});

mainRoutes.post(
  `/register`,
  [upload.single(`upload`), csrfProtection],
  async (req, res) => {
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
  }
);

mainRoutes.get(`/login`, csrfProtection, (req, res) => {
  const { email, validationMessages } = req.session;
  const csrfToken = req.csrfToken();

  req.session.email = null;
  req.session.validationMessages = null;

  const data = {
    email,
    validationMessages,
    csrfToken,
  };

  return res.render(`views/main/login`, data);
});

mainRoutes.post(
  `/login`,
  [upload.single(`upload`), csrfProtection],
  async (req, res) => {
    const { body } = req;

    const data = {
      email: body.email,
      password: body.password,
    };

    try {
      const accessToken = await api.loginUser(data);
      const loggedUser = jwtUtls.verifyAccessToken(accessToken);

      req.session.loggedUser = loggedUser;
      req.session.accessToken = accessToken;

      return res.redirect(`/`);
    } catch (err) {
      req.session.email = data.email;
      req.session.validationMessages = err.response.data.validationMessages;

      return res.redirect(`/login`);
    }
  }
);

mainRoutes.get(`/search`, async (req, res) => {
  if (!req.query.query) {
    return res.render(`views/main/search`);
  }

  const { query } = req.query;
  const results = await api.search(query);
  const data = { searchText: query, results };

  return results.length
    ? res.render(`views/main/search`, data)
    : res.render(`views/main/search-empty`, data);
});

mainRoutes.get(`/logout`, (req, res) => {
  req.session.destroy(() => res.redirect(`/login`));
});

module.exports = mainRoutes;

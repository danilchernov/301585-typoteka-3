"use strict";

const { Router } = require(`express`);

const defineModels = require(`../models`);
const sequelize = require(`../lib/sequelize`);

const categories = require(`./categories/categories`);
const articles = require(`./articles/articles`);
const comments = require(`./comments/comments`);
const search = require(`./search/search`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {
  const articlesCommentsRouter = comments(new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize), articlesCommentsRouter);
  search(app, new SearchService(sequelize));

  return app;
})();

module.exports = app;

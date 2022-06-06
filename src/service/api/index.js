"use strict";

const { Router } = require(`express`);

const defineModels = require(`../models`);
const sequelize = require(`../lib/sequelize`);

const categories = require(`./categories/categories`);
const articles = require(`./articles/articles`);
const comments = require(`./comments/comments`);
const search = require(`./search/search`);
const user = require(`./user/user`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService,
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

module.exports = async (logger) => {
  const articlesCommentsRouter = comments(
    new CommentService(sequelize),
    logger
  );

  categories(app, new CategoryService(sequelize), logger);
  articles(
    app,
    new ArticleService(sequelize),
    new CategoryService(sequelize),
    articlesCommentsRouter,
    logger
  );
  search(app, new SearchService(sequelize), logger);
  user(app, new UserService(sequelize), logger);

  return app;
};

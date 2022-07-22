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

module.exports = (logger) => {
  categories({ app, categoryService: new CategoryService(sequelize), logger });

  articles({
    app,
    articleService: new ArticleService(sequelize),
    categoryService: new CategoryService(sequelize),
    commentService: new CommentService(sequelize),
    logger,
  });

  comments({
    app,
    articleService: new ArticleService(sequelize),
    commentService: new CommentService(sequelize),
    logger,
  });

  search({ app, searchService: new SearchService(sequelize), logger });

  user({ app, userService: new UserService(sequelize), logger });

  return app;
};

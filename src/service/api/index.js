"use strict";

const { Router } = require(`express`);

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

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  const articlesCommentsRouter = comments(new CommentService());

  categories(app, new CategoryService(mockData));
  articles(app, new ArticleService(mockData), articlesCommentsRouter);
  search(app, new SearchService(mockData));

  return app;
})();

module.exports = app;

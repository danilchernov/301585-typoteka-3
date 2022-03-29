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

const api = new Router();

(async () => {
  const mockData = await getMockData();
  const articlesCommentsRouter = comments(new CommentService());

  categories(api, new CategoryService(mockData));
  articles(api, new ArticleService(mockData), articlesCommentsRouter);
  search(api, new SearchService(mockData));

  return api;
})();

module.exports = api;

"use strict";

const { Router } = require(`express`);

const categories = require(`./categories`);
const articles = require(`./articles`);
const search = require(`./search`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

module.exports = async () => {
  const mockData = await getMockData();
  categories(app, new CategoryService(mockData));
  articles(app, new ArticleService(mockData), new CommentService());
  search(app, new SearchService(mockData));

  return app;
};

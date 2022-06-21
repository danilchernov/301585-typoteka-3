"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../../data-service/search`);

const { HttpCode } = require(`../../../constants`);

const {
  mockCategories,
  mockArticles,
  mockComments,
  mockUsers,
} = require(`./search.mock`);
const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    comments: mockComments,
    users: mockUsers,
  });
  search(app, new DataService(mockDB));
});

describe(`API returns a list of articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `Обзор`,
    });
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should found 1 article`, () => {
    expect(response.body.length).toBe(1);
  });

  test(`Should return article with expected title`, () => {
    const EXPECTED_TITLE = `Обзор новейшего смартфона`;
    const [article] = response.body;
    expect(article.title).toBe(EXPECTED_TITLE);
  });
});

test(`API returns code 400 when query string is absent`, async () =>
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));

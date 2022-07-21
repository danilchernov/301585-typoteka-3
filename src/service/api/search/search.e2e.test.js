"use strict";

const http = require(`http`);
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const socket = require(`../../lib/socket`);
const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const search = require(`./search`);
const SearchService = require(`../../data-service/search`);

const { HttpCode } = require(`../../../constants`);

const { mockCategories, mockArticles } = require(`./search.mock`);
const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const logger = getLogger();

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.locals.io = io;
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
  });

  search({ app, searchService: new SearchService(mockDB), logger });
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

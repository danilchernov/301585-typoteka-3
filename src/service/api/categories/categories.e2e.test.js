"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const categories = require(`./categories`);
const CategoryService = require(`../../data-service/category`);

const { HttpCode } = require(`../../../constants`);

const { mockCategories, mockArticles } = require(`./categories.mock`);
const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const app = express();
const logger = getLogger();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    logger,
  });

  categories({ app, categoryService: new CategoryService(mockDB) });
});

describe(`API returns a list of categories`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return a list with 9 categories`, () => {
    expect(response.body.length).toBe(9);
  });

  test(`Should return a list of categories with expected titles`, () => {
    const EXPECTED_CATEGORIES_TITLES = [
      `Программирование`,
      `Без рамки`,
      `Железо`,
      `За жизнь`,
      `Деревья`,
      `IT`,
      `Музыка`,
      `Кино`,
      `Разное`,
    ];

    expect(response.body.map((it) => it.name)).toEqual(
      expect.arrayContaining(EXPECTED_CATEGORIES_TITLES)
    );
  });
});

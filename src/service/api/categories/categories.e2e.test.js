"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const categories = require(`./categories`);
const DataService = require(`../../data-service/category`);

const { mockData } = require(`./categories.mock`);

const app = express();
app.use(express.json());
categories(app, new DataService(mockData));

describe(`API returns a list of categories`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
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

    expect(response.body).toEqual(
      expect.arrayContaining(EXPECTED_CATEGORIES_TITLES)
    );
  });
});

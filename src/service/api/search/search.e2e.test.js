"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HttpCode } = require(`../../../constants`);

const search = require(`./search`);
const DataService = require(`../../data-service/search`);

const { mockData } = require(`./search.mock`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns a list of articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `обзор`,
    });
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should found 1 article`, () => {
    expect(response.body.length).toBe(1);
  });

  test(`Should return article with expected id`, () => {
    const EXPECTED_ID = `2ADkAX`;
    const [article] = response.body;
    expect(article.id).toBe(EXPECTED_ID);
  });
});

test(`API returns code 400 when query string is absent`, async () =>
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));

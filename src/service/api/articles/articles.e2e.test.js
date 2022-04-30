"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const articles = require(`./articles`);
const comments = require(`../comments/comments`);
const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);

const { HttpCode } = require(`../../../constants`);

const {
  mockCategories,
  mockArticles,
  mockArticleId,
  mockValidArticle,
  mockInvalidArticle,
} = require(`./articles.mock`);

const createApi = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles });

  const app = express();
  app.use(express.json());

  const articlesCommentsRouter = comments(new CommentService(mockDB));
  articles(app, new DataService(mockDB), articlesCommentsRouter);

  return app;
};

describe(`API returns a list of all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/articles`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return a list of 5 articles`, () => {
    expect(response.body.length).toBe(5);
  });
});

describe(`API returns an article with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/articles/${mockArticleId}`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return an article with expected title`, () => {
    const EXPECTED_TITLE = `Рок — это протест`;
    expect(response.body.title).toBe(EXPECTED_TITLE);
  });
});

describe(`API creates an article if the passed data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).post(`/articles`).send(mockValidArticle);
  });

  test(`Should return status code 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Should return the created article`, () => {
    expect(response.body.id).toEqual(6);
  });

  test(`Should increase the number of articles by 1`, () => {
    return request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API does not create an article if the passed data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createApi();
  });

  test(`Should return status code 400 without any required properties`, async () => {
    for (const key of Object.keys(mockValidArticle)) {
      const badArticle = { ...mockValidArticle };

      delete badArticle[key];

      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes an existing article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .put(`/articles/${mockArticleId}`)
      .send(mockValidArticle);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return true`, () => {
    expect(response.body).toBe(true);
  });

  test(`Should return article with expected title`, () => {
    const EXPECTED_TITLE = mockValidArticle.title;

    return request(app)
      .get(`/articles/${mockArticleId}`)
      .expect((res) => expect(res.body.title).toBe(EXPECTED_TITLE));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createApi();

  return request(app)
    .put(`/articles/NOEXIST`)
    .send(mockValidArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createApi();

  return request(app)
    .put(`/articles/${mockArticleId}`)
    .send(mockInvalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).delete(`/articles/${mockArticleId}`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return true`, () => {
    expect(response.body).toBe(true);
  });

  test(`Should decrease the number of articles by 1`, () => {
    return request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns status code 404 when trying to delete non-existent article`, async () => {
  const app = await createApi();
  return request(app).delete(`/articles/NOEXIST`).expect(HttpCode.NOT_FOUND);
});

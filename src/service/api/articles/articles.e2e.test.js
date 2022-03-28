"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const articles = require(`./articles`);
const comments = require(`../comments/comments`);

const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);

const {
  mockData,
  mockArticleId,
  mockValidArticle,
  mockInvalidData,
} = require(`./articles.mock`);

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const clonedData = JSON.parse(JSON.stringify(mockData));
  const articlesCommentsRouter = comments(new CommentService());

  articles(app, new DataService(clonedData), articlesCommentsRouter);
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Should return a list of 5 articles`, () => {
    expect(response.body.length).toBe(5);
  });

  test(`Should return article with expected id"`, () => {
    const EXPECTED_ID = mockArticleId;
    expect(response.body[0].id).toBe(EXPECTED_ID);
  });
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${mockArticleId}`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Should return an article with expected title`, () => {
    const EXPECTED_TITLE = `Рок — это протест`;
    expect(response.body.title).toBe(EXPECTED_TITLE);
  });
});

describe(`API creates an article if the passed data is valid`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(mockValidArticle);
  });

  test(`Should return status code 201`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.CREATED);
  });

  test(`Should return the created article`, () => {
    expect(response.body).toEqual(expect.objectContaining(mockValidArticle));
  });

  test(`Should increase the number of articles by 1`, () => {
    return request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API does not create an article if the passed data is invalid`, () => {
  const app = createAPI();

  test(`Should return status code 400 without any required properties`, async () => {
    for (const key of Object.keys(mockValidArticle)) {
      const badArticle = { ...mockValidArticle };

      delete badArticle[key];

      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HTTP_CODE.BAD_REQUEST);
    }
  });
});

describe(`API changes an existing article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${mockArticleId}`)
      .send(mockValidArticle);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Should return updated article`, () => {
    expect(response.body).toEqual(expect.objectContaining(mockValidArticle));
  });

  test(`Should return article with expected title`, () => {
    const EXPECTED_TITLE = mockValidArticle.title;

    return request(app)
      .get(`/articles/${mockArticleId}`)
      .expect((res) => expect(res.body.title).toBe(EXPECTED_TITLE));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .put(`/articles/NOEXIST`)
    .send(mockValidArticle)
    .expect(HTTP_CODE.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  return request(app)
    .put(`/articles/${mockArticleId}`)
    .send(mockInvalidData)
    .expect(HTTP_CODE.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/${mockArticleId}`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Should return deleted article`, () => {
    expect(response.body.id).toBe(mockArticleId);
  });

  test(`Should decrease the number of articles by 1`, () => {
    return request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns status code 404 when trying to delete non-existent article`, () => {
  const app = createAPI();
  return request(app).delete(`/articles/NOEXIST`).expect(HTTP_CODE.NOT_FOUND);
});

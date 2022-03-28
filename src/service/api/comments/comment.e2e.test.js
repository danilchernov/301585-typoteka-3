"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const articles = require(`../articles/articles`);
const comments = require(`./comments`);

const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);

const {
  mockData,
  mockArticleId,
  mockCommentId,
  mockValidComment,
  mockInvalidComment,
} = require(`./comments.mock`);

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const clonedData = JSON.parse(JSON.stringify(mockData));
  const articlesCommentsRouter = comments(new CommentService());

  articles(app, new DataService(clonedData), articlesCommentsRouter);
  return app;
};

describe(`API returns a list of comments for the specified article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${mockArticleId}/comments`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Should return a list of 2 comments`, () => {
    expect(response.body.length).toBe(2);
  });

  test(`Should return comment with expected id"`, () => {
    const EXPECTED_ID = mockCommentId;
    expect(response.body[0].id).toBe(EXPECTED_ID);
  });
});

test(`API returns status code 404 when trying to get a list of comments from a non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .get(`/articles/NOEXIST/comments/${mockCommentId}`)
    .expect(HTTP_CODE.NOT_FOUND);
});

describe(`API creates an comment if the passed data is valid`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${mockArticleId}/comments`)
      .send(mockValidComment);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.CREATED);
  });

  test(`Should return the created comment`, () => {
    expect(response.body).toEqual(expect.objectContaining(mockValidComment));
  });

  test(`Should increase the number of comments by 1`, () =>
    request(app)
      .get(`/articles/${mockArticleId}/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API returns status code 400 when trying to add a comment with invalid data`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/${mockArticleId}/comments`)
    .send(mockInvalidComment)
    .expect(HTTP_CODE.BAD_REQUEST);
});

test(`API returns status code 404 when trying to add a comment to a non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXIST/comments`)
    .send(mockValidComment)
    .expect(HTTP_CODE.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(
      `/articles/${mockArticleId}/comments/${mockCommentId}`
    );
  });

  test(`Should return status code 200`, () =>
    expect(response.statusCode).toBe(HTTP_CODE.OK));

  test(`Should return deleted comment`, () =>
    expect(response.body.id).toBe(mockCommentId));

  test(`Should decrease the number of articles by 1`, () =>
    request(app)
      .get(`/articles/${mockArticleId}/comments`)
      .expect((res) => expect(res.body.length).toBe(1)));
});

test(`API returns status code 404 when trying to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/${mockArticleId}/comments/NOEXIST`)
    .expect(HTTP_CODE.NOT_FOUND);
});

test(`API returns 404 status code when trying to remove a comment from a non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXIST/comments/IuMBOc`)
    .expect(HTTP_CODE.NOT_FOUND);
});

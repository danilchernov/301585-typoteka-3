"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const articles = require(`../articles/articles`);
const comments = require(`./comments`);

const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);

const { mockData, mockArticleId, mockCommentId } = require(`./comments.mock`);

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

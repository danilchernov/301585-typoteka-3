"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const articles = require(`../articles/articles`);
const comments = require(`./comments`);
const user = require(`../user/user`);

const ArticleService = require(`../../data-service/article`);
const CategoryService = require(`../../data-service/category`);
const CommentService = require(`../../data-service/comment`);
const UserService = require(`../../data-service/user`);

const { HttpCode } = require(`../../../constants`);

const {
  mockCategories,
  mockArticles,
  mockComments,
  mockUsers,
  mockAdminAuthData,
  mockAuthData,
  mockArticleId,
  mockCommentId,
  mockValidComment,
  mockInvalidComment,
} = require(`./comments.mock`);

process.env.JWT_SECRET = `jwt_secret`;

const createApi = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    comments: mockComments,
    users: mockUsers,
  });

  const app = express();
  const logger = getLogger();
  app.use(express.json());

  articles({
    app,
    articleService: new ArticleService(mockDB),
    categoryService: new CategoryService(mockDB),
    logger,
  });

  comments({
    app,
    articleService: new ArticleService(mockDB),
    commentService: new CommentService(mockDB),
    logger,
  });

  user({ app, userService: new UserService(mockDB), logger });

  return app;
};

let adminToken;
let token;

beforeAll(async () => {
  const app = await createApi();
  const [adminLoginResponse, loginResponse] = await Promise.all([
    await request(app).post(`/user/login`).send(mockAdminAuthData),
    await request(app).post(`/user/login`).send(mockAuthData),
  ]);

  adminToken = adminLoginResponse.body;
  token = loginResponse.body;
});

describe(`API returns comments from all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/comments`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return a list of 16 comments`, () => {
    expect(response.body.length).toBe(16);
  });
});

describe(`API returns a list of comments for the specified article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/articles/${mockArticleId}/comments`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return a list of 3 comments`, () => {
    expect(response.body.length).toBe(3);
  });

  test(`Should return comment with expected text"`, () => {
    const EXPECTED_TEXT = `А где блок питания? Неплохо, но дорого. А сколько игр в комплекте? Совсем немного... Вы что?! В магазине дешевле.`;
    expect(response.body[0].text).toBe(EXPECTED_TEXT);
  });
});

test(`API returns status code 404 when trying to get a list of comments from a non-existent article`, async () => {
  const app = await createApi();

  return request(app)
    .get(`/articles/12345/comments/${mockCommentId}`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API creates an comment if the passed data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .post(`/articles/${mockArticleId}/comments`)
      .set(`Authorization`, token)
      .send(mockValidComment);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Should return the created comment`, () => {
    expect(response.body).toEqual(expect.objectContaining(mockValidComment));
  });

  test(`Should increase the number of comments by 1`, () =>
    request(app)
      .get(`/articles/${mockArticleId}/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API does not create a comment if the passed data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createApi();
  });

  test(`Should return status code 400 without any required properties`, async () => {
    return request(app)
      .post(`/articles/${mockArticleId}/comments`)
      .set(`Authorization`, token)
      .send(mockInvalidComment)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should return status code 400 if the passed data does not match the desired type`, async () => {
    const badComments = [{ ...mockValidComment, text: 12345 }];
    for (const badComment of badComments) {
      await request(app)
        .post(`/articles/${mockArticleId}/comments`)
        .set(`Authorization`, token)
        .send(badComment)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match other schema criteria`, async () => {
    const badComments = [{ ...mockValidComment, title: `Short comment` }];
    for (const badComment of badComments) {
      await request(app)
        .post(`/articles/${mockArticleId}/comments`)
        .set(`Authorization`, token)
        .send(badComment)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

test(`API returns status code 404 when trying to add a comment to a non-existent article`, async () => {
  const app = await createApi();

  return request(app)
    .post(`/articles/12345/comments`)
    .set(`Authorization`, token)
    .send(mockValidComment)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/articles/${mockArticleId}/comments/${mockCommentId}`)
      .set(`Authorization`, adminToken);
  });

  test(`Should return status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Should return true`, () => expect(response.body).toBe(true));

  test(`Should decrease the number of comments by 1`, () =>
    request(app)
      .get(`/articles/${mockArticleId}/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API returns status code 404 when trying to delete non-existent comment`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/articles/${mockArticleId}/comments/12345`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 404 status code when trying to remove a comment from a non-existent article`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/articles/${mockArticleId}/comments/12345`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns a 400 status code if a parameter of the wrong type was passed in an attempt to interact with a resource`, async () => {
  const app = await createApi();

  await request(app)
    .delete(`/articles/${mockArticleId}/comments/id`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 401 if a user without a JWT adminToken tries to interact with comments`, async () => {
  const app = await createApi();

  await request(app)
    .post(`/articles/${mockArticleId}/comments`)
    .send(mockValidComment)
    .expect(HttpCode.UNAUTHORIZED);

  await request(app)
    .delete(`/articles/${mockArticleId}/comments/${mockCommentId}`)
    .expect(HttpCode.UNAUTHORIZED);
});

test(`API returns status code 403 if user does not have permission to interact with articles`, async () => {
  const app = await createApi();

  await request(app)
    .delete(`/articles/${mockArticleId}/comments/${mockCommentId}`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);
});

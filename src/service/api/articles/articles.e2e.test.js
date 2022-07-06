"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const articles = require(`./articles`);
const comments = require(`../comments/comments`);
const user = require(`../user/user`);

const ArticleService = require(`../../data-service/article`);
const CategoryService = require(`../../data-service/category`);
const CommentService = require(`../../data-service/comment`);
const UserService = require(`../../data-service/user`);

const { HttpCode } = require(`../../../constants`);

const {
  mockCategories,
  mockArticles,
  mockArticleId,
  mockValidArticle,
  mockInvalidArticle,
  mockUsers,
  mockAdminAuthData,
  mockAuthData,
} = require(`./articles.mock`);

process.env.JWT_SECRET = `jwt_secret`;

const createApi = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
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
  });

  user({ app, userService: new UserService(mockDB), logger });

  return app;
};

let adminToken;
let token;

beforeAll(async () => {
  const app = await createApi();

  const [adminLoginReponse, loginResponse] = await Promise.all([
    request(app).post(`/user/login`).send(mockAdminAuthData),
    request(app).post(`/user/login`).send(mockAuthData),
  ]);

  adminToken = adminLoginReponse.body;
  token = loginResponse.body;
});

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
    response = await request(app)
      .post(`/articles`)
      .set(`Authorization`, adminToken)
      .send(mockValidArticle);
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
    const badArticle = { ...mockValidArticle };
    for (const key of Object.keys(mockValidArticle)) {
      delete badArticle[key];

      await request(app)
        .post(`/articles`)
        .set(`Authorization`, adminToken)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match the desired type`, async () => {
    const badArticles = [
      { ...mockValidArticle, title: 12345 },
      { ...mockValidArticle, date: 111653737743971 },
      { ...mockValidArticle, categories: 12345 },
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .set(`Authorization`, adminToken)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match other schema criteria`, async () => {
    const badArticles = [
      { ...mockValidArticle, title: `Short title` },
      { ...mockValidArticle, announce: `Short announce` },
      { ...mockValidArticle, categories: [12345] },
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .set(`Authorization`, adminToken)
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
      .set(`Authorization`, adminToken)
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
    .put(`/articles/12345`)
    .set(`Authorization`, adminToken)
    .send(mockValidArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createApi();

  return request(app)
    .put(`/articles/${mockArticleId}`)
    .set(`Authorization`, adminToken)
    .send(mockInvalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/articles/${mockArticleId}`)
      .set(`Authorization`, adminToken);
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
  return request(app)
    .delete(`/articles/12345`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 if an invalid type was passed when trying to interact with an article`, async () => {
  const app = await createApi();

  await request(app).get(`/articles/id`).expect(HttpCode.BAD_REQUEST);

  await request(app)
    .put(`/articles/id`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);

  await request(app)
    .delete(`/articles/id`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API will return status code 401 if a user without a JWT adminToken tries to interact with articles`, async () => {
  const app = await createApi();

  await request(app)
    .post(`/articles`)
    .send(mockValidArticle)
    .expect(HttpCode.UNAUTHORIZED);

  await request(app)
    .put(`/articles/${mockArticleId}`)
    .expect(HttpCode.UNAUTHORIZED);

  await request(app)
    .delete(`/articles/${mockArticleId}`)
    .expect(HttpCode.UNAUTHORIZED);
});

test(`API returns status code 403 if user does not have permission to interact with articles`, async () => {
  const app = await createApi();

  await request(app)
    .post(`/articles`)
    .send(mockValidArticle)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);

  await request(app)
    .put(`/articles/${mockArticleId}`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);

  await request(app)
    .delete(`/articles/${mockArticleId}`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);
});

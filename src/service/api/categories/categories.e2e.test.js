"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const categories = require(`./categories`);
const user = require(`../user/user`);

const CategoryService = require(`../../data-service/category`);
const UserService = require(`../../data-service/user`);

const { HttpCode } = require(`../../../constants`);

const {
  mockArticles,
  mockCategories,
  mockCategoryId,
  mockCategoryIdToDelete,
  mockUsers,
  mockAdminAuthData,
  mockAuthData,
  mockValidCategory,
} = require(`./categories.mock`);

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

  categories({ app, categoryService: new CategoryService(mockDB), logger });

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

describe(`API returns a list of categories`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/categories`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return a list with 9 categories`, () => {
    expect(response.body.length).toBe(10);
  });

  test(`Should return a list of categories with expected names`, () => {
    const EXPECTED_NAMES = [
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
      expect.arrayContaining(EXPECTED_NAMES)
    );
  });
});

describe(`API returns a category with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).get(`/categories/${mockCategoryId}`);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Should return a category with expected name`, () => {
    const EXPECTED_NAME = `Программирование`;
    expect(response.body.name).toBe(EXPECTED_NAME);
  });
});

describe(`API creates a category if the passed data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .post(`/categories`)
      .set(`Authorization`, adminToken)
      .send(mockValidCategory);
  });

  test(`Should return status code 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Should return the created category`, () => {
    expect(response.body.id).toEqual(11);
  });

  test(`Should increase the number of categories by 1`, () => {
    return request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(11));
  });
});

describe(`API does not create a category if the passed data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createApi();
  });

  test(`Should return status code 400 without any required properties`, async () => {
    const badCategory = { ...mockValidCategory };
    for (const key of Object.keys(mockValidCategory)) {
      delete badCategory[key];

      await request(app)
        .post(`/categories`)
        .set(`Authorization`, adminToken)
        .send(badCategory)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match the desired type`, async () => {
    const badCategories = [{ ...mockValidCategory, name: 12345 }];

    for (const badCategory of badCategories) {
      await request(app)
        .post(`/categories`)
        .set(`Authorization`, adminToken)
        .send(badCategory)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match other schema criteria`, async () => {
    const badCategories = [{ ...mockValidCategory, title: `Short title` }];
    for (const badCategory of badCategories) {
      await request(app)
        .post(`/categories`)
        .set(`Authorization`, adminToken)
        .send(badCategory)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes a existing category`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .put(`/categories/${mockCategoryId}`)
      .set(`Authorization`, adminToken)
      .send(mockValidCategory);
  });

  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return true`, () => {
    expect(response.body).toBe(true);
  });

  test(`Should return category with expected name`, () => {
    const EXPECTED_NAME = mockValidCategory.name;

    return request(app)
      .get(`/categories/${mockCategoryId}`)
      .expect((res) => expect(res.body.name).toBe(EXPECTED_NAME));
  });
});

test(`API returns status code 404 when trying to change non-existent category`, async () => {
  const app = await createApi();

  return request(app)
    .put(`/categories/12345`)
    .set(`Authorization`, adminToken)
    .send(mockValidCategory)
    .expect(HttpCode.NOT_FOUND);
});

test(`API cannot delete a category if it has at least 1 article`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/categories/${mockCategoryId}`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a category without articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app)
      .delete(`/categories/${mockCategoryIdToDelete}`)
      .set(`Authorization`, adminToken);
  });
  test(`Should return status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return true`, () => {
    expect(response.body).toBe(true);
  });

  test(`Should decrease the number of categories by 1`, () => {
    return request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(9));
  });
});

test(`API returns status code 404 when trying to delete non-existent category`, async () => {
  const app = await createApi();

  return request(app)
    .delete(`/categories/12345`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns a 400 status code if a parameter of the wrong type was passed in an attempt to interact with a resource`, async () => {
  const app = await createApi();

  await request(app).get(`/categories/id`).expect(HttpCode.BAD_REQUEST);

  await request(app)
    .put(`/categories/id`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);

  await request(app)
    .delete(`/categories/id`)
    .set(`Authorization`, adminToken)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API will return status code 401 if a user without a JWT adminToken tries to interact with articles`, async () => {
  const app = await createApi();

  await request(app)
    .post(`/categories`)
    .send(mockValidCategory)
    .expect(HttpCode.UNAUTHORIZED);

  await request(app)
    .put(`/categories/${mockCategoryId}`)
    .expect(HttpCode.UNAUTHORIZED);

  await request(app)
    .delete(`/categories/${mockCategoryId}`)
    .expect(HttpCode.UNAUTHORIZED);
});

test(`API returns status code 403 if user does not have permission to interact with categories`, async () => {
  const app = await createApi();

  await request(app)
    .post(`/categories`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);

  await request(app)
    .put(`/categories/${mockCategoryId}`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);

  await request(app)
    .delete(`/categories/${mockCategoryId}`)
    .set(`Authorization`, token)
    .expect(HttpCode.FORBIDDEN);
});

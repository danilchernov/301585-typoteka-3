"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const { getLogger } = require(`../../lib/logger`);

const user = require(`./user`);
const DataService = require(`../../data-service/user`);

const { HttpCode } = require(`../../../constants`);
const { mockValidUser, mockValidAuthData } = require(`./user.mock`);

const createApi = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, {
    categories: [],
    articles: [],
    users: [],
    comments: [],
  });

  const app = express();
  const logger = getLogger();
  app.use(express.json());

  user(app, new DataService(mockDB), logger);

  return app;
};

describe(`API creates an user if the passed data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    response = await request(app).post(`/user`).send(mockValidUser);
  });

  test(`Should return status code 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Should return the created user`, () => {
    expect(response.body.email).toEqual(mockValidUser.email);
  });
});

describe(`API does not create an user if the passed data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createApi();
  });

  test(`Should return status code 400 without any required properties`, async () => {
    const badUser = { ...mockValidUser };
    for (const key of Object.keys(mockValidUser)) {
      delete badUser[key];

      await request(app)
        .post(`/user`)
        .send(badUser)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should return status code 400 if the passed data does not match other schema criteria`, async () => {
    const badUsers = [
      { ...mockValidUser, firstName: `Jake1` },
      { ...mockValidUser, firstName: `Ja ke` },
      { ...mockValidUser, lastName: `Archib@ld` },
      { ...mockValidUser, lastName: `A rchibald` },
      { ...mockValidUser, email: `jaffathecake0gmail.com` },
      { ...mockValidUser, password: `pswrd`, repeatedPassword: `pswrd` },
      {
        ...mockValidUser,
        repeatedPassword: mockValidUser.password.split(``).reverse().join(``),
      },
    ];
    for (const badUser of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUser)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

test(`API does not create an user if user with email address is already registered`, async () => {
  const app = await createApi();

  const firstUser = { ...mockValidUser };
  const secondUser = { ...mockValidUser };

  await request(app).post(`/user`).send(firstUser).expect(HttpCode.CREATED);
  await request(app)
    .post(`/user`)
    .send(secondUser)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API will register the first user and assign him the administrator role`, async () => {
  const app = await createApi();

  const firstUser = { ...mockValidUser };
  const secondUser = { ...mockValidUser, email: `test@gmail.com` };

  await request(app)
    .post(`/user`)
    .send(firstUser)
    .expect((res) => expect(res.body.admin).toBe(true));

  await request(app)
    .post(`/user`)
    .send(secondUser)
    .expect((res) => expect(res.body.admin).toBe(false));
});

describe(`API authenticate user if data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApi();
    await request(app).post(`/user`).send(mockValidUser);

    response = await request(app).post(`/user/login`).send(mockValidAuthData);
  });

  test(`Should return status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return an user with expected firstName`, () =>
    expect(response.body.firstName).toBe(mockValidUser.firstName));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createApi();
    await request(app).post(`/user`).send(mockValidUser);
  });

  test(`Should return status code 400 if email is incorrect`, async () => {
    const badAuthData = { ...mockValidAuthData, email: `random@gmail.com` };

    await request(app)
      .post(`/user/login`)
      .send(badAuthData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should return status code 400 if password does not match`, async () => {
    const badAuthData = {
      ...mockValidAuthData,
      password: `randomPa$$w0Rd`,
    };
    await request(app)
      .post(`/user/login`)
      .send(badAuthData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

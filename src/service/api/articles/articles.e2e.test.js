"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const articles = require(`./articles`);
const comments = require(`../comments/comments`);

const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);

const mockData = [
  {
    id: `lK8k3l`,
    title: `Рок — это протест`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    category: [
      `Программирование`,
      `Без рамки`,
      `Кино`,
      `Деревья`,
      `Разное`,
      `За жизнь`,
      `IT`,
    ],
    comments: [
      { id: `CJcW4a`, text: `Оплата наличными или перевод на карту?` },
      { id: `kj-9ic`, text: `А где блок питания?` },
    ],
    createdDate: `2022-02-09 15:04:29`,
  },
  {
    id: `cP8XjH`,
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Деревья`, `Кино`, `Музыка`, `Без рамки`],
    comments: [
      { id: `pCFZ_b`, text: `Вы что?! В магазине дешевле.` },
      { id: `Sm8ZDU`, text: `Неплохо, но дорого. А где блок питания?` },
      {
        id: `ZC4lja`,
        text: `А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`,
      },
      { id: `5fVlr4`, text: `Неплохо, но дорого. А сколько игр в комплекте?` },
      { id: `vXrpYQ`, text: `Совсем немного...` },
    ],
    createdDate: `2022-01-11 14:07:51`,
  },
  {
    id: `E3-tNO`,
    title: `Как начать программировать`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [`Разное`, `Программирование`, `За жизнь`, `Музыка`],
    comments: [
      {
        id: `5gAfTt`,
        text: `А сколько игр в комплекте? А где блок питания? С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `NPXQOJ`,
        text: `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`,
      },
      { id: `pCMfSh`, text: `Продаю в связи с переездом. Отрываю от сердца.` },
      {
        id: `gHG9hx`,
        text: `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?`,
      },
    ],
    createdDate: `2022-03-13 11:18:16`,
  },
  {
    id: `emsaQh`,
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`За жизнь`],
    comments: [
      { id: `Ws4ztQ`, text: `Оплата наличными или перевод на карту?` },
    ],
    createdDate: `2022-01-03 20:33:56`,
  },
  {
    id: `OjroWc`,
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Это один из лучших рок-музыкантов.`,
    fullText: `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [`Программирование`, `IT`],
    comments: [
      { id: `P2ogXx`, text: `Продаю в связи с переездом. Отрываю от сердца.` },
    ],
    createdDate: `2022-03-16 13:06:33`,
  },
];

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const clonedData = JSON.parse(JSON.stringify(mockData));
  const articlesCommentsRouter = comments(new CommentService());

  articles(app, new DataService(clonedData), articlesCommentsRouter);
  return app;
};

describe(`API return a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Returns a list of 5 articles`, () => {
    expect(response.body.length).toBe(5);
  });

  test(`First article has correct id"`, () => {
    const CORRECT_ID = `lK8k3l`;
    expect(response.body[0].id).toBe(CORRECT_ID);
  });
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/lK8k3l`);
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Article's title is correct`, () => {
    const CORRECT_TITLE = `Рок — это протест`;
    expect(response.body.title).toBe(CORRECT_TITLE);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    category: [`New category`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.CREATED);
  });

  test(`Returns the created article`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });

  test(`Articles count is changed`, () => {
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    category: [`New category`],
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = { ...newArticle };

      delete badArticle[key];

      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HTTP_CODE.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Updated title`,
    announce: `Updated announce`,
    fullText: `Updated full text`,
    category: [`Updated category`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/lK8k3l`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.OK));

  test(`Returns the updated article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/lK8k3l`)
      .expect((res) => expect(res.body.title).toBe(`Updated title`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Valid title`,
    announce: `Valid announce`,
    fullText: `Valid full text`,
    category: [`Valid category`],
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HTTP_CODE.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    // title: `Valid title`,
    announce: `Valid announce`,
    fullText: `Valid full text`,
    category: [`Valid category`],
  };

  return request(app)
    .put(`/articles/lK8k3l`)
    .send(invalidArticle)
    .expect(HTTP_CODE.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/lK8k3l`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.OK));

  test(`Returns deleted article`, () =>
    expect(response.body.id).toBe(`lK8k3l`));

  test(`Article count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HTTP_CODE.NOT_FOUND);
});

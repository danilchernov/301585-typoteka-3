"use strict";

const express = require(`express`);
const request = require(`supertest`);
const { HTTP_CODE } = require(`../../../constants`);

const search = require(`./search`);
const DataService = require(`../../data-service/search`);

const mockData = [
  {
    id: `2ADkAX`,
    title: `Обзор новейшего смартфона`,
    announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    category: [
      `Железо`,
      `Без рамки`,
      `Разное`,
      `Программирование`,
      `За жизнь`,
      `IT`,
    ],
    comments: [
      {
        id: `zKg2yC`,
        text: `С чем связана продажа? Почему так дешёво? А где блок питания?`,
      },
      { id: `WXawUg`, text: `Неплохо, но дорого.` },
      {
        id: `57vWcK`,
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`,
      },
    ],
    createdDate: `2022-02-18 09:30:56`,
  },
  {
    id: `RCH217`,
    title: `Как собрать камни бесконечности`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов.`,
    category: [
      `Музыка`,
      `IT`,
      `За жизнь`,
      `Разное`,
      `Без рамки`,
      `Деревья`,
      `Железо`,
      `Программирование`,
    ],
    comments: [{ id: `Si9vjy`, text: `Почему в таком ужасном состоянии?` }],
    createdDate: `2022-01-25 19:03:37`,
  },
  {
    id: `cq_wF9`,
    title: `Как собрать камни бесконечности`,
    announce: `Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    category: [`Железо`, `Программирование`, `IT`, `Деревья`],
    comments: [
      {
        id: `rGlrQ8`,
        text: `Совсем немного... Оплата наличными или перевод на карту?`,
      },
      { id: `GTJfXV`, text: `С чем связана продажа? Почему так дешёво?` },
    ],
    createdDate: `2022-02-05 03:53:32`,
  },
  {
    id: `Pt_cS0`,
    title: `Самый лучший музыкальный альбом этого года`,
    announce: ``,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Кино`, `Деревья`, `За жизнь`, `IT`],
    comments: [
      {
        id: `kS7US4`,
        text: `Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте? С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `btIKde`,
        text: `С чем связана продажа? Почему так дешёво? Совсем немного...`,
      },
      {
        id: `BsQUg7`,
        text: `А где блок питания? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`,
      },
    ],
    createdDate: `2022-01-20 13:02:00`,
  },
  {
    id: `T4ueYr`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [`Железо`],
    comments: [
      { id: `C9M_K7`, text: `Неплохо, но дорого. А сколько игр в комплекте?` },
      {
        id: `LwTaaj`,
        text: `Оплата наличными или перевод на карту? Неплохо, но дорого.`,
      },
      {
        id: `qoORk5`,
        text: `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца.`,
      },
      { id: `mQF5CP`, text: `Вы что?! В магазине дешевле. Совсем немного...` },
    ],
    createdDate: `2021-12-28 19:39:05`,
  },
];

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

  test(`Status code ${HTTP_CODE.OK}`, () => {
    expect(response.statusCode).toBe(HTTP_CODE.OK);
  });

  test(`Found 1 article`, () => {
    expect(response.body.length).toBe(1);
  });

  test(`The found article has the correct id`, () => {
    const CORRECT_ID = `2ADkAX`;
    const [article] = response.body;
    expect(article.id).toBe(CORRECT_ID);
  });
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HTTP_CODE.BAD_REQUEST);
});

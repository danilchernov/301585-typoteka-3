'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {EXIT_CODE} = require(`../../constants`);
const {shuffle, getRandomInt, getRandomDate, formatDate} = require(`../../utils`);

const COUNT = {
  MIN: 1,
  MAX: 1000
};

const FILE_NAME = `mock.json`;

const TITLES = [
  `Ёлки`, `История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево.`,
  `Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего.`,
  `Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка.`,
  `Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно.`,
  `Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно.`,
  `Просто действуйте.`,
  `Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания.`,
  `Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами.`,
  `Так ли это на самом деле? Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи.`,
  `Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года.`,
  `Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const generateTitle = () => TITLES[getRandomInt(0, TITLES.length - 1)];

const generateAnnounce = () => shuffle(SENTENCES).slice(0, getRandomInt(1, 5)).join(` `);

const genereteFullText = () => shuffle(SENTENCES).slice(0, getRandomInt(1, SENTENCES.length)).join(` `);

const generateDate = () => {
  const today = new Date();
  const nMonthsAgo = new Date(today).setMonth(today.getMonth() - 3);

  return formatDate(getRandomDate(new Date(nMonthsAgo), today));
};

const generateCategory = () => shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length - 1));

const generateOffers = (count) => {
  return Array(count).fill({}).map(() => {
    return {
      title: generateTitle(),
      announce: generateAnnounce(),
      fullText: genereteFullText(),
      category: generateCategory(),
      createdDate: generateDate(),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || COUNT.MIN;

    if (countOffer > COUNT.MAX) {
      console.error(chalk.red(`No more than ${COUNT.MAX} publications`));
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }

    const content = JSON.stringify(generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);

      console.info(chalk.green(`Operation success. File ${FILE_NAME} created.`));
      process.exit(EXIT_CODE.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file ${FILE_NAME}.`));
      console.error(chalk.red(`${err.message}`));
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }
  }
};

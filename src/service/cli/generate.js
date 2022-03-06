'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {EXIT_CODE} = require(`../../constants`);
const {shuffle, getRandomInt, getRandomDate, formatDate} = require(`../../utils`);

const COUNT = {
  MIN: 1,
  MAX: 1000
};

const FILE_MOCK = `mock.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err.message));
    return [];
  }
};

const generateTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];

const generateAnnounce = (sentences) => shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `);

const genereteFullText = (sentences) => shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `);

const generateDate = () => {
  const today = new Date();
  const nMonthsAgo = new Date(today).setMonth(today.getMonth() - 3);

  return formatDate(getRandomDate(new Date(nMonthsAgo), today));
};

const generateCategory = (categories) => shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));

const generateOffers = (count, titles, categories, sentences) => {
  return Array(count).fill({}).map(() => {
    return {
      title: generateTitle(titles),
      announce: generateAnnounce(sentences),
      fullText: genereteFullText(sentences),
      category: generateCategory(categories),
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

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_MOCK, content);

      console.info(chalk.green(`Operation success. File ${FILE_MOCK} created.`));
      process.exit(EXIT_CODE.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file ${FILE_MOCK}.`));
      console.error(chalk.red(`${err.message}`));
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }
  }
};

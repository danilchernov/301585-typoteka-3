"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { nanoid } = require(`nanoid`);
const { EXIT_CODE, MAX_ID_LENGTH } = require(`../../constants`);
const {
  shuffle,
  getRandomInt,
  getRandomDate,
  formatDate,
} = require(`../../utils`);

const COUNT = {
  MIN: 1,
  MAX: 1000,
};

const FILE_MOCK = `mock.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

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

const generateAnnounce = (count = 1, sentences) => {
  return shuffle(sentences)
    .slice(0, count - 1)
    .join(` `);
};

const generateImage = (images) => images[getRandomInt(0, images.length - 1)];

const genereteFullText = (count = 1, sentences) => {
  return shuffle(sentences)
    .slice(0, getRandomInt(1, count - 1))
    .join(` `);
};

const generateDate = () => {
  const today = new Date();
  const nMonthsAgo = new Date(today).setMonth(today.getMonth() - 3);

  return formatDate(getRandomDate(new Date(nMonthsAgo), today));
};

const generateCategory = (count = 1, categories) => {
  return shuffle(categories).slice(0, getRandomInt(1, count - 1));
};

const generateComments = (count = 1, comments) => {
  return Array(getRandomInt(1, count))
    .fill({})
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        text: shuffle(comments)
          .slice(0, getRandomInt(1, count - 1))
          .join(` `),
      };
    });
};

const generateArticles = (
  count,
  titles,
  categories,
  images,
  sentences,
  comments
) => {
  return Array(count)
    .fill({})
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        title: generateTitle(titles),
        announce: generateAnnounce(getRandomInt(1, 5), sentences),
        image: generateImage(images),
        fullText: genereteFullText(sentences.length, sentences),
        category: generateCategory(getRandomInt(3, 5), categories),
        comments: generateComments(getRandomInt(1, 5), comments),
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
    const images = await readContent(FILE_IMAGES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const content = JSON.stringify(
      generateArticles(
        countOffer,
        titles,
        categories,
        images,
        sentences,
        comments
      )
    );

    try {
      await fs.writeFile(FILE_MOCK, content);

      console.info(
        chalk.green(`Operation success. File ${FILE_MOCK} created.`)
      );
      process.exit(EXIT_CODE.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file ${FILE_MOCK}.`));
      console.error(chalk.red(`${err.message}`));
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }
  },
};

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

const FILE_NAME = `mock.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const ARTICLE_LIMIT = {
  MIN: 1,
  MAX: 1000,
};

const ANNOUNCE_LIMIT = {
  MIN: 1,
  MAX: 3,
};

const FULL_TEXT_LIMIT = {
  MIN: 5,
  MAX: 10,
};

const CATEGORY_LIMIT = {
  MIN: 3,
  MAX: 5,
};

const COMMENT_LIMIT = {
  MIN: 3,
  MAX: 5,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err.message));
    return [];
  }
};

const generateTitle = (titles) => {
  return shuffle(titles)[getRandomInt(0, titles.length - 1)];
};

const generateAnnounce = (count = 1, sentences) => {
  return shuffle(sentences).slice(0, count).join(` `);
};

const generateImage = (images) => {
  return images[getRandomInt(0, images.length - 1)];
};

const genereteFullText = (count, sentences) => {
  return shuffle(sentences).slice(0, count).join(` `);
};

const generateDate = () => {
  const today = new Date();
  const nMonthsAgo = new Date(today).setMonth(today.getMonth() - 3);

  return formatDate(getRandomDate(new Date(nMonthsAgo), today));
};

const generateCategory = (count = 1, categories) => {
  return shuffle(categories).slice(0, count);
};

const generateComments = (count = 1, comments) => {
  return Array(count)
    .fill({})
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        text: shuffle(comments).slice(0, getRandomInt(1, count)).join(` `),
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
        announce: generateAnnounce(
          getRandomInt(ANNOUNCE_LIMIT.MIN, ANNOUNCE_LIMIT.MAX),
          sentences
        ),
        image: generateImage(images),
        fullText: genereteFullText(
          getRandomInt(FULL_TEXT_LIMIT.MIN, FULL_TEXT_LIMIT.MAX),
          sentences
        ),
        category: generateCategory(
          getRandomInt(CATEGORY_LIMIT.MIN, CATEGORY_LIMIT.MAX),
          categories
        ),
        comments: generateComments(
          getRandomInt(COMMENT_LIMIT.MIN, COMMENT_LIMIT.MAX),
          comments
        ),
        createdDate: generateDate(),
      };
    });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ARTICLE_LIMIT.MIN;

    if (countArticles > ARTICLE_LIMIT.MAX) {
      console.error(
        chalk.red(`No more than ${ARTICLE_LIMIT.MAX} publications`)
      );
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const images = await readContent(FILE_IMAGES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const content = JSON.stringify(
      generateArticles(
        countArticles,
        titles,
        categories,
        images,
        sentences,
        comments
      )
    );

    try {
      await fs.writeFile(FILE_NAME, content);

      console.info(
        chalk.green(`Operation success. File ${FILE_NAME} created.`)
      );
      process.exit(EXIT_CODE.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file ${FILE_NAME}.`));
      console.error(chalk.red(`${err.message}`));
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }
  },
};

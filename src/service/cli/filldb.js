"use strict";

const fs = require(`fs`).promises;

const { getLogger } = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);

const { ExitCode } = require(`../../constants`);

const {
  shuffle,
  getRandomInt,
  getRandomDate,
  formatDate,
} = require(`../../utils`);

const logger = getLogger({ name: `api` });

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_NAMES_PATH = `./data/first-names.txt`;
const FILE_SURNAMES_PATH = `./data/last-names.txt`;
const FILE_EMAILS_PATH = `./data/emails.txt`;

const ArticleLimit = {
  MIN: 1,
  MAX: 1000,
};

const AnnounceLimit = {
  MIN: 1,
  MAX: 3,
};

const FullTextLimit = {
  MIN: 5,
  MAX: 10,
};

const CategoryLimit = {
  MIN: 3,
  MAX: 5,
};

const CommentLimit = {
  MIN: 3,
  MAX: 5,
};

const AvatarLimit = {
  MIN: 1,
  MAX: 5,
};

const UserLimit = {
  MIN: 5,
};

const MONTH_PERIOD = 3;
const DEFAULT_PASSWORD = `$2a$10$47Jc9oY.7eu.NnjaJ5wBbu.TvUbYkQSEpZcvB0v.sDDobGTR1/P6m`; // 1234567890

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err.message);
    return [];
  }
};

const genetareAvatar = (id) => `avatar-${id}.png`;

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
  const nMonthsAgo = new Date(today).setMonth(today.getMonth() - MONTH_PERIOD);

  return formatDate(getRandomDate(new Date(nMonthsAgo), today));
};

const generateCategories = (count = 1, categories) => {
  return shuffle(categories).slice(0, count);
};

const generateUsers = (count = 1, firstNames, lastNames, emails) => {
  return Array(count)
    .fill({})
    .map((_, index) => ({
      firstName: firstNames[getRandomInt(0, count - 1)],
      lastName: lastNames[getRandomInt(0, count - 1)],
      email: emails[index],
      passwordHash: DEFAULT_PASSWORD,
      avatar: genetareAvatar(getRandomInt(AvatarLimit.MIN, AvatarLimit.MAX)),
      admin: index === 0,
    }));
};

const generateArticleComments = (
  count = 1,
  articleId,
  comments,
  usersCount
) => {
  return Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(CommentLimit.MIN, CommentLimit.MAX))
        .join(` `),
      articleId,
      userId: getRandomInt(1, usersCount),
    }));
};

const generateComments = (count = 1, comments, usersCount) => {
  return Array(count)
    .fill()
    .reduce((acc, _, index) => {
      return acc.concat(
        generateArticleComments(
          getRandomInt(CommentLimit.MIN, CommentLimit.MAX),
          index + 1,
          comments,
          usersCount
        )
      );
    }, []);
};

const generateArticles = (count = 1, titles, categories, images, sentences) => {
  return Array(count)
    .fill({})
    .map(() => {
      return {
        title: generateTitle(titles),
        announce: generateAnnounce(
          getRandomInt(AnnounceLimit.MIN, AnnounceLimit.MAX),
          sentences
        ),
        image: generateImage(images),
        fullText: genereteFullText(
          getRandomInt(FullTextLimit.MIN, FullTextLimit.MAX),
          sentences
        ),
        categories: generateCategories(
          getRandomInt(CategoryLimit.MIN, CategoryLimit.MAX),
          categories
        ),
        date: generateDate(),
      };
    });
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(
        `An unexpected error occurred while trying to connect to the database: ${err.message}`
      );
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }
    logger.info(`Connection to database established`);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ArticleLimit.MIN;

    if (countArticles > ArticleLimit.MAX) {
      logger.error(`No more than ${ArticleLimit.MAX} publications`);
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const images = await readContent(FILE_IMAGES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const commentsSentences = await readContent(FILE_COMMENTS_PATH);
    const firstNames = await readContent(FILE_NAMES_PATH);
    const lastNames = await readContent(FILE_SURNAMES_PATH);
    const emails = await readContent(FILE_EMAILS_PATH);

    const users = generateUsers(UserLimit.MIN, firstNames, lastNames, emails);

    const articles = generateArticles(
      countArticles,
      titles,
      categories,
      images,
      sentences
    );

    const comments = generateComments(
      countArticles,
      commentsSentences,
      UserLimit.MIN
    );

    return initDB(sequelize, { articles, categories, users, comments });
  },
};

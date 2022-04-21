"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const { EXIT_CODE } = require(`../../constants`);
const { shuffle, getRandomInt } = require(`../../utils`);

const FILE_NAME = `fill-db.sql`;
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
  MIN: 1,
  MAX: 3,
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

const generateComments = (count, articleId, userCount, comments) => {
  return Array(count)
    .fill({})
    .map(() => ({
      articleId,
      userId: getRandomInt(1, userCount),
      text: shuffle(comments).slice(0, getRandomInt(1, count)).join(` `),
    }));
};

const generateCategories = (count, categoryCount) => {
  const categories = new Set(
    Array(count)
      .fill()
      .map(() => {
        return getRandomInt(1, categoryCount);
      })
  );

  return [...categories];
};

const generateArticles = (
  count,
  titles,
  categoryCount,
  userCount,
  sentences,
  images,
  comments
) =>
  Array(count)
    .fill({})
    .map((_, index) => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences)
        .slice(0, getRandomInt(ANNOUNCE_LIMIT.MIN, ANNOUNCE_LIMIT.MAX))
        .join(` `),
      fullText: shuffle(sentences)
        .slice(0, getRandomInt(FULL_TEXT_LIMIT.MIN, FULL_TEXT_LIMIT.MAX))
        .join(` `),
      comments: generateComments(
        getRandomInt(COMMENT_LIMIT.MIN, COMMENT_LIMIT.MAX),
        index + 1,
        userCount,
        comments
      ),
      category: generateCategories(
        getRandomInt(CATEGORY_LIMIT.MIN, CATEGORY_LIMIT.MAX),
        categoryCount
      ),
      image: images[getRandomInt(0, images.length - 1)],
      userId: getRandomInt(1, userCount),
    }));

module.exports = {
  name: `--fill`,
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
    const articleSentences = await readContent(FILE_SENTENCES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`,
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`,
      },
    ];

    const articles = generateArticles(
      countArticles,
      titles,
      categories.length,
      users.length,
      articleSentences,
      images,
      commentSentences
    );

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.flatMap((article, index) =>
      article.category.map((category) => ({
        articleId: index + 1,
        categoryId: category,
      }))
    );

    const userValues = users
      .map(
        ({ email, passwordHash, firstName, lastName, avatar }) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles
      .map(
        ({ title, announce, fullText, image, userId }) =>
          `('${title}', '${announce}', '${fullText}', '${image}', ${userId})`
      )
      .join(`,\n`);

    const articleCategoryValues = articleCategories
      .map(({ articleId, categoryId }) => `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(
        ({ text, userId, articleId }) => `('${text}', ${userId}, ${articleId})`
      )
      .join(`,\n`);

    const content = `
      INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
      ${userValues};
      INSERT INTO categories(name) VALUES
      ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, announce, full_text, image, user_id) VALUES
      ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE articles_categories DISABLE TRIGGER ALL;
      INSERT INTO articles_categories(article_id, category_id) VALUES
      ${articleCategoryValues};
      ALTER TABLE articles_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_id) VALUES
      ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(EXIT_CODE.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(EXIT_CODE.error);
    }
  },
};

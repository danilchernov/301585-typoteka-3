"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const { getLogger } = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

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
        categories: generateCategory(
          getRandomInt(CategoryLimit.MIN, CategoryLimit.MAX),
          categories
        ),
        comments: generateComments(
          getRandomInt(CommentLimit.MIN, CommentLimit.MAX),
          comments
        ),
        createdDate: generateDate(),
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
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }
    logger.info(`Connection to database established`);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ArticleLimit.MIN;

    if (countArticles > ArticleLimit.MAX) {
      console.error(chalk.red(`No more than ${ArticleLimit.MAX} publications`));
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }

    const { Category, Article } = defineModels(sequelize);

    await sequelize.sync({ force: true });

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const images = await readContent(FILE_IMAGES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({ name: item }))
    );

    const articles = generateArticles(
      countArticles,
      titles,
      categoryModels,
      images,
      sentences,
      comments
    );

    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {
        include: [Alias.COMMENTS],
      });
      await articleModel.addCategories(article.categories);
    });

    await Promise.all(articlePromises);
  },
};

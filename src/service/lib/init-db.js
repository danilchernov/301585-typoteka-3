"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (
  sequelize,
  { articles = [], categories = [], comments = [], users = [] }
) => {
  const { Category, Article, Comment, User } = defineModels(sequelize);
  await sequelize.sync({ force: true });

  await Category.bulkCreate(categories);

  await User.bulkCreate(users);

  const articlePromises = articles.map(async (article) => {
    const ArticleModel = await Article.create(article, {
      include: [Alias.COMMENTS],
    });

    await ArticleModel.addCategories(article.categories);
  });

  await Promise.all(articlePromises);

  await Comment.bulkCreate(comments);
};

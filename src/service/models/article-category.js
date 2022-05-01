"use strict";

const { Model } = require(`sequelize`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  return ArticleCategory.init(
    {},
    {
      sequelize,
      modelName: `ArticleCategory`,
      tableName: `articles_categories`,
    }
  );
};

module.exports = { define };

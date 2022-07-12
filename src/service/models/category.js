/* eslint-disable new-cap */

"use strict";

const { Model, DataTypes } = require(`sequelize`);

const Alias = require(`./alias`);

class Category extends Model {}

const define = (sequelize) => {
  return Category.init(
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: `Category`,
      tableName: `categories`,
    }
  );
};

const defineRelations = (models) => {
  Category.belongsToMany(models.Article, {
    through: models.ArticleCategory,
    as: Alias.ARTICLES,
  });

  Category.hasMany(models.ArticleCategory, {
    as: Alias.ARTICLES_CATEGORIES,
  });
};

module.exports = { define, defineRelations };

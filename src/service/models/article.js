"use strict";

const { Model, DataTypes } = require(`sequelize`);

const Alias = require(`./alias`);

class Article extends Model {}

const define = (sequelize) => {
  return Article.init(
    {
      title: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      announce: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      fullText: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      image: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: `Article`,
      tableName: `articles`,
    }
  );
};

const defineRelations = (models) => {
  Article.hasMany(models.Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`,
  });

  Article.belongsToMany(models.Category, {
    through: models.ArticleCategory,
    as: Alias.CATEGORIES,
  });
};

module.exports = { define, defineRelations };

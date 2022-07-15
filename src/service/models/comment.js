"use strict";

const { Model, DataTypes } = require(`sequelize`);

const Alias = require(`./alias`);

class Comment extends Model {}

const define = (sequelize) => {
  return Comment.init(
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: `Comment`,
      tableName: `comments`,
    }
  );
};

const defineRelations = (models) => {
  Comment.belongsTo(models.Article, {
    as: Alias.ARTICLES,
    foreignKey: `articleId`,
    onDelete: `CASCADE`,
  });

  Comment.belongsTo(models.User, {
    as: Alias.USERS,
    foreignKey: `userId`,
    onDelete: `CASCADE`,
  });
};

module.exports = { define, defineRelations };

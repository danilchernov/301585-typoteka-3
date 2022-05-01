"use strict";

const { Model, DataTypes } = require(`sequelize`);

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
  Comment.belongsTo(models.Article, { foreignKey: `articleId` });
};

module.exports = { define, defineRelations };

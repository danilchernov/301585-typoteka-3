"use strict";

const { Model, DataTypes } = require(`sequelize`);

const Alias = require(`./alias`);

class User extends Model {}

const define = (sequelize) => {
  return User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: `User`,
      tableName: `users`,
    }
  );
};

const defineRelations = (models) => {
  User.hasMany(models.Comment, { as: Alias.COMMENTS, foreignKey: `userId` });
};

module.exports = { define, defineRelations };

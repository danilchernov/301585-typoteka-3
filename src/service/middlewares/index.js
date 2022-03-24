"use strict";

const articleMiddlewares = require(`./article`);
const commentMiddlewares = require(`./comment`);

module.exports = {
  ...articleMiddlewares,
  ...commentMiddlewares,
};

'use strict';

const articleValidator = require(`./article/validator`);
const articleExist = require(`./article/exist`);
const commentValidator = require(`./comment/validator`);
const commentExist = require(`./comment/exist`);

module.exports = {
  articleValidator,
  articleExist,
  commentValidator,
  commentExist
};

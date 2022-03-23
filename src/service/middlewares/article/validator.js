'use strict';

const {HTTP_CODE} = require(`../../../constants`);
const articleKeys = [`title`, `announce`, `fullText`, `category`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = keys.every((key) => articleKeys.includes(key));

  if (!keysExists) {
    res.status(HTTP_CODE.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

"use strict";

const { HttpCode } = require(`../../../constants`);
const requiredKeys = [`title`, `announce`, `image`, `fullText`, `categories`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);

  const requiredKeysExist = requiredKeys.every((key) => keys.includes(key));

  if (!requiredKeysExist) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

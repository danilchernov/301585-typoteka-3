"use strict";

const { HTTP_CODE } = require(`../../../constants`);
const requiredKeys = [`title`, `announce`, `image`, `fullText`, `category`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);

  const requiredKeysExist = requiredKeys.every((key) => keys.includes(key));

  if (!requiredKeysExist) {
    return res.status(HTTP_CODE.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

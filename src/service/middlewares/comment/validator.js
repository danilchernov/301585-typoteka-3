"use strict";

const { HTTP_CODE } = require(`../../../constants`);
const articleKeys = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExists = keys.every((key) => articleKeys.includes(key));

  if (!keysExists) {
    res.status(HTTP_CODE.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

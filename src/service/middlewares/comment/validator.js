"use strict";

const { HttpCode } = require(`../../../constants`);
const requiredKeys = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);

  const requiredKeysExist = requiredKeys.every((key) => keys.includes(key));

  if (!requiredKeysExist) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

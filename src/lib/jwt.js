"use strict";

const jwt = require(`jsonwebtoken`);

module.exports.generateAccessToken = (tokenData) => {
  return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: `1d` });
};

module.exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

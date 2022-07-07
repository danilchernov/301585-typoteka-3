"use strict";

const jwt = require(`jsonwebtoken`);

const EXPIRES_IN = `1d`;

module.exports.generateAccessToken = (tokenData) => {
  return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
};

module.exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

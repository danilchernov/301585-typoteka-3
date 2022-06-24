"use strict";

const { HttpCode } = require(`../../constants`);
const jwtUtils = require(`../../lib/jwt`);

module.exports = async (req, res, next) => {
  const accessToken = req.headers[`authorization`];

  if (!accessToken) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  try {
    const user = await jwtUtils.verifyAccessToken(accessToken);

    res.locals.user = user;

    return next();
  } catch (err) {
    return res.sendStatus(HttpCode.FORBIDDEN);
  }
};

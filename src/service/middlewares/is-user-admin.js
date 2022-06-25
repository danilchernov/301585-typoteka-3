"use strict";

const { HttpCode } = require(`../../constants`);

module.exports = (req, res, next) => {
  const { user } = res.locals;

  if (!user.admin) {
    return res.sendStatus(HttpCode.FORBIDDEN);
  }

  return next();
};

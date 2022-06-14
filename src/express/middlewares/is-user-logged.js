"use strict";

module.exports = (req, res, next) => {
  const { loggedUser } = req.session;

  if (!loggedUser) {
    return res.redirect(`/login`);
  }

  return next();
};

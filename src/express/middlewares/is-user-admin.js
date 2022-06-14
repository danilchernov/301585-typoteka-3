"use strict";

module.exports = (req, res, next) => {
  const { loggedUser } = req.session;

  if (!loggedUser || !loggedUser.admin) {
    return res.redirect(`/`);
  }

  return next();
};

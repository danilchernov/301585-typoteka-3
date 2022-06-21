"use strict";

const csrf = require(`csurf`);

module.exports = csrf({
  value: (req) => req.body.csrf,
});

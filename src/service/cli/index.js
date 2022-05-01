"use strict";

const help = require(`./help`);
const filldb = require(`./filldb`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);

const Cli = {
  [help.name]: help,
  [filldb.name]: filldb,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
};

module.exports = {
  Cli,
};

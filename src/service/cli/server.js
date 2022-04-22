"use strict";

const express = require(`express`);
const api = require(`../api`);

const { getLogger } = require(`../lib/logger`);
const { ExitCode, HttpCode, API_PREFIX } = require(`../../constants`);
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({ name: `api` });

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  return next();
});

app.use(API_PREFIX, api);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      const [customPort] = args;
      const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

      app.listen(port, (err) => {
        if (err) {
          return logger.error(
            `An error occurred on server creation: ${err.message}`
          );
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }
  },
};

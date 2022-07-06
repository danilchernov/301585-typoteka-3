"use strict";

const express = require(`express`);
const initializeApiRoutes = require(`../api`);
const sequelize = require(`../lib/sequelize`);
const { getLogger } = require(`../lib/logger`);
const { ExitCode, HttpCode, API_PREFIX } = require(`../../constants`);

const DEFAULT_PORT = 3000;

const logger = getLogger({ name: `api` });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`[${req.method}] Request on route ${req.originalUrl}`);

  res.on(`finish`, () => {
    const message = `[${req.method}] Response status code ${res.statusCode} on route ${req.originalUrl}`;

    switch (res.statusCode) {
      case 404:
        logger.warn(message);
        break;
      default:
        logger.info(message);
    }
  });

  return next();
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(
        `An unexpected error occurred while trying to connect to the database: ${err.message}`
      );
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }
    logger.info(`Connection to database established`);

    try {
      const [customPort] = args;
      const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

      app.use(API_PREFIX, initializeApiRoutes(logger));

      app.use((req, res) => {
        res.status(HttpCode.NOT_FOUND).send(`Not found`);
        logger.warn(
          `[${req.method}] Route not found ${req.originalUrl}: ${req.url}`
        );
      });

      app.use((err, req, _res, _next) => {
        logger.error(
          `[${req.method}] An unexpected error occurred while processing the request ${req.originalUrl}: ${err.message}`
        );
      });

      app.listen(port, () =>
        logger.info(`Listening to connections on ${port}`)
      );
    } catch (err) {
      logger.error(
        `An unexpected error occurred during server initialization: ${err.message}`
      );
      process.exit(ExitCode.UNCAUGHT_FATAL_EXCEPTION);
    }
  },
};

"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const routes = require(`../api`);

const { EXIT_CODE, HTTP_CODE, API_PREFIX } = require(`../../constants`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      const [customPort] = args;
      const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

      const app = express();

      app.use(express.json());
      app.use(API_PREFIX, await routes());
      app.use((req, res) => res.status(HTTP_CODE.NOT_FOUND).send(`Not found`));

      app.listen(port, () =>
        console.info(chalk.green(`Waiting for connection on port: ${port}`))
      );
    } catch (err) {
      console.error(
        chalk.red(
          `An error occurred while initializing the server: ${err.message}`
        )
      );
      process.exit(EXIT_CODE.UNCAUGHT_FATAL_EXCEPTION);
    }
  },
};

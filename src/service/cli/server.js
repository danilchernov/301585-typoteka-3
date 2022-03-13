'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const chalk = require(`chalk`);

const {HTTP_CODE} = require(`../../constants`);

const FILE_MOCK = `mock.json`;
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());

    app.get(`/offers`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILE_MOCK, `utf8`);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        res.send([]);
      }
    });

    app.use((req, res) => res.status(HTTP_CODE.NOT_FOUND).send(`Not found`));

    app.listen(port, () => console.info(chalk.green(`Waiting for connection on port: ${port}`)));
  }
};

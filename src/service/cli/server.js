'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);

const {HTTP_CODE} = require(`../../constants`);

const FILE_MOCK = `mock.json`;
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const sendResponse = (res, statusCode, message) => {
      const template = `
      <!Doctype html>
        <html lang="ru">
        <head>
          <title>With love from Node</title>
        </head>
        <body>${message}</body>
      </html>`.trim();

      res.writeHead(statusCode, {
        'Content-Type': `text/html; charset=UTF-8`,
      });

      res.end(template);
    };

    const onClientConnect = async (req, res) => {
      const notFoundMessageText = `Not found`;

      switch (req.url) {
        case `/`:
          try {
            const fileContent = await fs.readFile(FILE_MOCK, `utf8`);
            const mocks = JSON.parse(fileContent);
            const message = mocks.map((offer) => `<li>${offer.title}</li>`).join(``);
            sendResponse(res, HTTP_CODE.OK, `<ul>${message}</ul>`);
          } catch (err) {
            sendResponse(res, HTTP_CODE.NOT_FOUND, notFoundMessageText);
          }
          break;

        default:
          sendResponse(res, HTTP_CODE.NOT_FOUND, notFoundMessageText);
          break;
      }
    };

    const server = http.createServer(onClientConnect);

    server.listen(port, () => console.info(chalk.green(`Waiting for connection on port: ${port}`)));
    server.on(`error`, ({message}) => console.error(chalk.red(`Error creating server: ${message}`)));

  }
};

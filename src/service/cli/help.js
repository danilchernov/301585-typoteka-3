"use strict";

const chalk = require(`chalk`);
const commandLineUsage = require(`command-line-usage`);

const generateUsageInformation = () => {
  const sections = [
    {
      header: `Typoteka`,
      content: `The program starts the http-server and generates a file with data for the API.`,
    },
    {
      header: `Guide:`,
      content: `service.js <command>`,
    },
    {
      header: `Commands:`,
      optionList: [
        {
          name: `version`,
          description: `Display version.`,
          type: Boolean,
        },
        {
          name: `help`,
          description: `Display this usage guide.`,
          type: Boolean,
        },
        {
          name: `filldb`,
          typeLabel: `{underline count}`,
          description: `Generates {underline count} articles and saves them to the database.`,
        },
        {
          name: `server`,
          typeLabel: `{underline port}`,
          description: `Starts the API server on the specified {underline port}. If the port is not specified, then the {bold 3000} will be selected.`,
        },
        {
          name: `fill`,
          typeLabel: `{underline count}`,
          description: `Generates the {bold fill-db.sql} file. The file describes {underline count} SQL queries to create the necessary fake data.`,
        },
      ],
    },
  ];

  return chalk.gray(commandLineUsage(sections));
};

module.exports = {
  name: `--help`,
  run() {
    console.info(generateUsageInformation());
  },
};

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
          name: `generate`,
          typeLabel: `{underline <count>}`,
          description: `Generates an array with test publications in the amount of {underline <count>} and saves them to the {bold mocks.json} file in the project root directory.`,
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

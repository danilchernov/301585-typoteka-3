"use strict";

const { Cli } = require(`./cli`);

const { ExitCode } = require(`../constants`);

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(userArguments.slice(1));

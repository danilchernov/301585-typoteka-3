"use strict";

const pino = require(`pino`);
const { ENV } = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === ENV.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  transport: {
    targets: [
      {
        level: `info`,
        target: `pino-pretty`,
      },
      {
        level: `error`,
        target: `pino-pretty`,
        options: { destination: LOG_FILE, mkdir: true },
      },
    ],
  },
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};

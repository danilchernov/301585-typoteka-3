'use strict';

module.exports.EXIT_CODE = {
  SUCCESS: 0,
  UNCAUGHT_FATAL_EXCEPTION: 1
};

module.exports.HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.MAX_ID_LENGTH = 6;

module.exports.API_PREFIX = `/api`;

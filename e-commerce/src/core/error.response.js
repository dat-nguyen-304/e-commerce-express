// const logger = require('../loggers/winston.log');
const myLogger = require('../loggers/my-logger.log');

const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const StatusCodeReason = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.now = Date.now();
  }
}

class ConflictError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.CONFLICT,
    statusCode = StatusCode.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

class RedisError extends ErrorResponse {
  constructor(
    message = StatusCodeReason.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  RedisError,
};

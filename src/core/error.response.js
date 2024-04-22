const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409
}

const StatusCodeReason = {
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT'
}


class ErrorResponse extends Error {
    constructor (message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor (message = StatusCodeReason.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor (message = StatusCodeReason.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class UnauthorizedRequestError extends ErrorResponse {
    constructor (message = StatusCodeReason.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor (message = StatusCodeReason.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

module.exports = {
    UnauthorizedRequestError,
    ConflictRequestError,
    BadRequestError,
    ForbiddenRequestError
}
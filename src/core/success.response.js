const StatusCode = {
    OK: 200,
    CREATED: 201
}

const StatusCodeReason = {
    OK: 'OK',
    CREATED: 'CREATED'
}

class SuccessResponse {
    constructor ({ message, statusCode = StatusCode.OK, statusCodeReason = StatusCodeReason.OK, metadata = {} }) {
        this.message = !message ? statusCodeReason : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send (res) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor ({ message = StatusCodeReason.OK, statusCode = StatusCode.OK, metadata }) {
        super({ message, statusCode, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor ({ message = StatusCodeReason.CREATED, statusCode = StatusCode.CREATED, metadata }) {
        super({ message, statusCode, metadata })
    }
}

module.exports = {
    OK, CREATED
}
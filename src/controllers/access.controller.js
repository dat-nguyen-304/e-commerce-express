const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new OK({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register OK!',
            metadata: await AccessService.signUp(req.body),
        }).send(res);
    }

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Refresh successfully',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    }
}

module.exports = new AccessController()
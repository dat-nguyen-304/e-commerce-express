const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}


const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify hahaha: `, err);
            } else {
                console.log(`decode verify `, decode);
            }
        })

        return { accessToken, refreshToken };

    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new BadRequestError('Invalid request');
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw NotFoundError('Not found key store');
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw UnauthorizedError('Invalid request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw UnauthorizedError('Invalid userId');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }

})

module.exports = {
    createTokenPair,
    authentication
}
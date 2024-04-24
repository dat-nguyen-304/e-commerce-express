const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
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
        console.log({ error });
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new BadRequestError('Need x-api-key');
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found key store');
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError('Need access token');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid userId');
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error;
    }
})

const checkRefreshToken = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new BadRequestError('Need x-api-key');
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found key store');

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (!refreshToken) throw new UnauthorizedError('Need refresh token');

    try {
        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid userId');
        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;
        return next();
    } catch (error) {
        throw error;
    }
})

const verifyJWT = (token, key) => {
    return JWT.verify(token, key);
}

module.exports = {
    createTokenPair,
    authentication,
    checkRefreshToken,
    verifyJWT
}
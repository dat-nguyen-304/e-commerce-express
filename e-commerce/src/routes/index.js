const express = require('express');
const { permission, apiKey } = require('../auth/checkAuth');
const { pushToLogDiscord } = require('../middleware/index');

const router = express.Router();
router.use(pushToLogDiscord);
router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/check-out', require('./checkout'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api/notification', require('./notification'));
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api/profile', require('./profile'));
router.use('/v1/api', require('./access'));

module.exports = router;

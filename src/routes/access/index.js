const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication, checkRefreshToken } = require('../../auth/authUtils');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

router.post(
  '/shop/logout',
  authentication,
  asyncHandler(accessController.logout),
);
router.post(
  '/shop/refresh-token',
  checkRefreshToken,
  asyncHandler(accessController.handleRefreshToken),
);

module.exports = router;

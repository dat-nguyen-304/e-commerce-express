const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get('/', asyncHandler(notificationController.listNotificationsByUser));

module.exports = router;

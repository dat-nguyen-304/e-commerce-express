const express = require('express');
const uploadController = require('../../controllers/upload.controller.js');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

router.post('/product', asyncHandler(uploadController.uploadProduct));
module.exports = router;

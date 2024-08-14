const express = require('express');
const uploadController = require('../../controllers/upload.controller.js');
const asyncHandler = require('../../helpers/asyncHandler');
const { uploadDisk } = require('../../configs/multer.config.js');
const router = express.Router();

router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadThumb),
);
router.post('/product', asyncHandler(uploadController.uploadProduct));

module.exports = router;

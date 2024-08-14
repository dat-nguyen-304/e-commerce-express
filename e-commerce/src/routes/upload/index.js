const express = require('express');
const uploadController = require('../../controllers/upload.controller.js');
const asyncHandler = require('../../helpers/asyncHandler');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config.js');
const router = express.Router();

router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadThumb),
);
router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  asyncHandler(uploadController.uploadToS3),
);
router.post('/product', asyncHandler(uploadController.uploadProduct));

module.exports = router;

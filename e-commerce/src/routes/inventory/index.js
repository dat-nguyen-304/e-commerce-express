const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.post(
  '',
  authentication,
  asyncHandler(inventoryController.addStockToInventory),
);

module.exports = router;

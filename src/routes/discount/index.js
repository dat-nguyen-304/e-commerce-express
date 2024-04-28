const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/applied-products', asyncHandler(discountController.getProductsByDiscountCode));
router.post('', authentication, asyncHandler(discountController.createDiscount));
router.get('', authentication, asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;


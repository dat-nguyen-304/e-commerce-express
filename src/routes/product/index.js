const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();


router.get('/search/:keyword', asyncHandler(productController.searchProducts));
router.use(authentication);

router.post('', asyncHandler(productController.createProduct));
router.get('/drafts', asyncHandler(productController.getAllDraftsForShop));
router.get('/published', asyncHandler(productController.getAllPublishForShop));
router.patch('/published/:id', asyncHandler(productController.publishProductByShop));
router.patch('/unpublished/:id', asyncHandler(productController.unpublishProductByShop));

module.exports = router;
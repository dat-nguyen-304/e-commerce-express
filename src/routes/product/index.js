const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();


router.get('/search/:keyword', asyncHandler(productController.searchProducts));
router.get('/:product_id', asyncHandler(productController.getProduct));
router.get('', asyncHandler(productController.getAllProducts));
router.use(authentication);

router.post('', asyncHandler(productController.createProduct));
router.patch('/:product_id', asyncHandler(productController.updateProduct));
router.get('/drafts', asyncHandler(productController.getAllDraftsForShop));
router.get('/published', asyncHandler(productController.getAllPublishForShop));
router.patch('/published/:id', asyncHandler(productController.publishProductByShop));
router.patch('/unpublished/:id', asyncHandler(productController.unpublishProductByShop));

module.exports = router;
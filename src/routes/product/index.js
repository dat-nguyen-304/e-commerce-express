const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get('/drafts', authentication, asyncHandler(productController.getAllDraftsForShop));
router.get('/published', authentication, asyncHandler(productController.getAllPublishForShop));
router.patch('/published/:id', authentication, asyncHandler(productController.publishProductByShop));
router.patch('/unpublished/:id', authentication, asyncHandler(productController.unpublishProductByShop));
router.get('/search/:keyword', asyncHandler(productController.searchProducts));
router.route('/')
    .get(asyncHandler(productController.getAllProducts))
    .post(authentication, asyncHandler(productController.createProduct));
router.route('/:product_id')
    .get(asyncHandler(productController.getProduct))
    .patch(authentication, asyncHandler(productController.updateProduct))
module.exports = router;
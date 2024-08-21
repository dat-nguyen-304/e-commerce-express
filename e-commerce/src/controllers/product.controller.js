const ProductService = require('../services/product.service');
const { OK } = require('../core/success.response');
const { newSpu, oneSpu } = require('../services/spu.service');
const { oneSku } = require('../services/sku.service');

class ProductController {
  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;
      new OK({
        message: 'Get Sku successfully',
        metadata: await oneSku({ sku_id, product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query;
      new OK({
        message: 'Get Spu successfully',
        metadata: await oneSpu({ spu_id: product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({
        ...req.body,
        product_shop: req.user.userId,
      });
      new OK({
        message: 'Create Spu successfully',
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    new OK({
      message: 'Create new product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new OK({
      message: 'Get all products successfully',
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new OK({
      message: 'Get product successfully',
      metadata: await ProductService.findProductById({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: 'Get draft list successfully',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new OK({
      message: 'Get publish list successfully',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new OK({
      message: 'Publish product successfully',
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new OK({
      message: 'Unpublish product successfully',
      metadata: await ProductService.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new OK({
      message: 'Search successfully',
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: 'Update successfully',
      metadata: await ProductService.updateProduct({
        ...req.body,
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();

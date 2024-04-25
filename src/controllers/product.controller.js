const ProductService = require('../services/product.service');
const { OK } = require('../core/success.response');

class ProductController {
    createProduct = async (req, res, next) => {
        new OK({
            message: 'Create new product successfully',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        }).send(res);
    }

    getAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'Get draft list successfully',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new OK({
            message: 'Get publish list successfully',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new OK({
            message: 'Publish product successfully',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unpublishProductByShop = async (req, res, next) => {
        new OK({
            message: 'Unpublish product successfully',
            metadata: await ProductService.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    searchProducts = async (req, res, next) => {
        new OK({
            message: 'Search successfully',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res);
    }
}

module.exports = new ProductController();
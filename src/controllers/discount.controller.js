const DiscountService = require('../services/discount.service');
const { OK } = require('../core/success.response');

class DiscountController {
    createDiscount = async (req, res, next) => {
        new OK({
            message: 'Successful code generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountCodes = async (req, res, next) => {
        new OK({
            message: 'Found discount',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: 'Success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    getProductsByDiscountCode = async (req, res, next) => {
        new OK({
            message: 'Found products',
            metadata: await DiscountService.getProductsByDiscountCode({
                ...req.query
            })
        }).send(res);
    }
}

module.exports = new DiscountController();
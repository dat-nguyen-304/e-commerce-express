const DiscountService = require('../services/discount.service');
const { OK } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  addToCart = async (req, res, next) => {
    new OK({
      message: 'Create new cart success',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new OK({
      message: 'Update cart success',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteCartItem = async (req, res, next) => {
    new OK({
      message: 'Delete cart success',
      metadata: await CartService.deleteCartItem(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new OK({
      message: 'List cart success',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();

const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../repositories/cart.repo');
const { checkProductByServer } = require('../repositories/product.repo');
const DiscountService = require('./discount.service');

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError('Cart does not exist');

    const checkoutOrder = {
        totalPrice: 0,
        shipFee: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProduct = await checkProductByServer(item_products);
      if (!checkProduct[0]) throw new BadRequestError('order wrong!');
      const checkoutPrice = checkProduct.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      console.log({ checkoutPrice });
      checkoutOrder.totalPrice = +checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        price_raw: checkoutPrice,
        price_applied_discount: checkoutPrice,
        item_products: checkProduct,
      };
      if (shop_discounts.length > 0) {
        const { discount } = await DiscountService.getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProduct,
        });

        checkoutOrder.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.price_applied_discount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.price_applied_discount;
      shop_order_ids_new.push(itemCheckout);
      return {
        shop_order_ids,
        shop_order_ids_new,
        checkout_order: checkoutOrder,
      };
    }
  }
}

module.exports = CheckoutService;

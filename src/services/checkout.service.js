const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../repositories/cart.repo');
const { checkProductByServer } = require('../repositories/product.repo');
const DiscountService = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');

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

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids: shop_order_ids,
      });
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireLock.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Please check your cart again');
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    if (newOrder) {
    }
    return newOrder;
  }

  static async getOrdersByUser() {}

  static async getOneOrderByUser() {}

  static async cancelOrderByUser() {}

  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;

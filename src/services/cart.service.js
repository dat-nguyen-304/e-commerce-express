const { cart } = require('../models/cart.model');
const { findProductById } = require('../repositories/product.repo');
const { NotFoundError } = require('../core/error.response');

class CartService {
  static async createUserCart({ userId, firstProduct }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_items: firstProduct,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({
      cart_userId: userId,
    });
    if (!userCart) {
      return await CartService.createUserCart({
        userId,
        firstProduct: product,
      });
    }

    if (!userCart.cart_items.length) {
      userCart.cart_items = [product];
      return await userCart.save();
    }

    return await CartService.updateItemQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity } = shop_order_ids[0]?.item_products[0];

    const foundProduct = await findProductById({
      product_id: productId,
      unSelect: ['__v'],
    });
    if (!foundProduct) throw new NotFoundError('Product not found!');
    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId)
      throw new NotFoundError('Not found!');
    if (quantity === 0) {
    }

    return await CartService.updateItemQuantity({
      userId,
      product: {
        productId,
        quantity,
      },
    });
  }

  static async updateItemQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_items.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_items.$.quantity': quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async deleteCartItem({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_items: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;

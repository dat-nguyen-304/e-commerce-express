const { update } = require('lodash');
const { BadRequestError } = require('../core/error.response');
const { inventory } = require('../models/inventory.model');
const getProductById = require('../models/product.model');

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '',
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError('Product does not exist');
    const query = { ivt_shopId: shopId, ivt_productId: productId },
      updateSet = {
        $inc: {
          ivt_stock: stock,
        },
        $set: {
          ivt_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;

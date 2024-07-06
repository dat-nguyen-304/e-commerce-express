const { inventory } = require('../models/inventory.model');
const { Types } = require('mongoose');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  return await inventory.create({
    ivt_productId: productId,
    ivt_stock: stock,
    ivt_location: location,
    ivt_shopId: shopId,
  });
};

module.exports = {
  insertInventory,
};

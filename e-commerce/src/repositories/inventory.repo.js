const { inventory } = require('../models/inventory.model');
const { Types } = require('mongoose');
const { convertToObjectIdMongodb } = require('../utils');

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

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      ivt_productId: convertToObjectIdMongodb(productId),
      ivt_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        ivt_stock: -quantity,
      },
      $push: {
        ivt_reservation: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };

  return await inventory.updateOne(query, updateSet);
};

module.exports = {
  insertInventory,
  reservationInventory,
};

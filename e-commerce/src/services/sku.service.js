const { randomProductId } = require('../utils');
const Sku = require('../models/sku.model');
const _ = require('lodash');

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });
    const skus = await Sku.create(convert_sku_list);
    return skus;
  } catch (error) {
    return [];
  }
};

const oneSku = async ({ sku_id, product_id }) => {
  try {
    const sku = await Sku.findOne({
      sku_id,
      product_id,
    }).lean();
    console.log(sku);

    return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']);
  } catch (error) {
    return null;
  }
};

const allSkusBySpuId = async ({ product_id }) => {
  try {
    const skus = await Sku.find({ product_id });
    return skus;
  } catch (error) {}
};

module.exports = {
  newSku,
  oneSku,
  allSkusBySpuId,
};

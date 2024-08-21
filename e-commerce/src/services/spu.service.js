const { findShopById } = require('../repositories/shop.repo');
const { NotFoundError } = require('../core/error.response');
const { randomProductId } = require('../utils');
const Spu = require('../models/spu.model');
const { newSku, allSkusBySpuId } = require('./sku.service');
const _ = require('lodash');

const newSpu = async ({
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variation,
  sku_list = [],
}) => {
  try {
    const foundShop = await findShopById({ shop_id: product_shop });
    if (!foundShop) throw new NotFoundError('Shop not found');
    const spu = await Spu.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variation,
      sku_list,
    });

    if (spu && sku_list.length) {
      await newSku({ sku_list, spu_id: spu.product_id });
    }
    return spu;
  } catch (error) {}
};

const oneSpu = async ({ spu_id }) => {
  try {
    const spu = await Spu.findOne({
      product_id: spu_id,
    });
    if (!spu) throw new NotFoundError('Spu not found');
    const skus = await allSkusBySpuId({ product_id: spu.product_id });

    return {
      spu_info: _.omit(spu, ['__v', 'updatedAt', 'createdAt', 'isDeleted']),
      sku_list: skus.map((sku) =>
        _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']),
      ),
    };
  } catch (error) {}
};

module.exports = {
  newSpu,
  oneSpu,
};

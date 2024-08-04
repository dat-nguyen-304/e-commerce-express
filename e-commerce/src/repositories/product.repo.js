const { Types } = require('mongoose');
const {
  product,
  electronic,
  clothing,
  furniture,
} = require('../models/product.model');
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongodb,
} = require('../utils');

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProductById = async ({ product_id, unSelect }) => {
  return await product
    .findById(convertToObjectIdMongodb(product_id))
    .select(unGetSelectData(unSelect));
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const searchProducts = async ({ keyword }) => {
  const regexSearch = new RegExp(keyword);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById({
        product_id: product.productId,
      });
      if (foundProduct)
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
    }),
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findProductById,
  updateProductById,
  checkProductByServer,
};

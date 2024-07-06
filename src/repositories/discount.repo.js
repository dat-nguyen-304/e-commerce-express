const { getSelectData, unGetSelectData } = require('../utils');

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return discounts;
};

const findAllDiscountCodeUnselect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean();
  return discounts;
};

const checkDiscountExist = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnselect,
  checkDiscountExist,
};

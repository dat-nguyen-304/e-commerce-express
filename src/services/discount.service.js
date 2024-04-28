const { BadRequestError, NotFoundError } = require('../core/error.response');
const discount = require('../models/discount.model');
const { convertToObjectIdMongodb } = require('../utils');
const { findAllProducts } = require('../repositories/product.repo');
const { findAllDiscountCodeSelect, findAllDiscountCodeUnselect, checkDiscountExist } = require('../repositories/discount.repo');

class DiscountService {
    static async createDiscountCode (payload) {
        const {
            code, type, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to,
            name, description, value, max_value, quantity, used_number, max_usage_per_user, used_users
        } = payload;
        if (new Date() > new Date(start_date) || new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Date of discount is invalid')
        }
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount existed')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_type: type,
            discount_description: description,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_quantity: quantity,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_used_number: used_number,
            discount_max_value: max_value,
            discount_used_users: used_users,
            discount_max_usage_per_user: max_usage_per_user,
            discount_shop_id: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount;
    }

    static async getProductsByDiscountCode ({ code, shopId, limit, page }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shopId)
        }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not found')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products = [];
        if (discount_applies_to === 'all') {
            products = findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }

        if (discount_applies_to === 'specific') {
            products = findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: page,
                sort: 'ctime',
                select: ['product_name']
            });
        }
        return products;
    }

    static async getAllDiscountCodesByShop ({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_code', 'discount_name'],
            model: discount
        });
        return discounts;
    }

    static async getDiscountAmount ({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount does not exist`);
        const { discount_is_active, discount_quantity, discount_end_date, discount_min_order_value, discount_max_usage_per_user, discount_used_users, discount_type, discount_value } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError(`Discount expired`);
        if (!discount_quantity) throw new NotFoundError(`Discount is out`);
        if (new Date() > new Date(discount_end_date)) {
            throw new NotFoundError(`Discount expired`);
        }
        let orderTotal = 0;
        if (discount_min_order_value > 0) {
            orderTotal = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);
            if (orderTotal < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_usage_per_user > 0) {
            const userDiscount = discount_used_users.find(user => user.userId === userId);
            if (userDiscount) {

            }
        }

        const discountAmount = discount_type === 'fixed_amount' ? discount_value : orderTotal * discount_value / 100;
        return {
            orderTotal,
            discount: discountAmount,
            totalPrice: orderTotal - discountAmount
        }
    }

    static async deleteDiscountCode ({ shopId, codeId }) {
        //handle simply (not recommend)
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted;
    }

    static async cancelDiscountCode ({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_used_users: userId,
            },
            $inc: {
                discount_quantity: -1,
                discount_used_number: 1,
            }
        })
        return result;
    }
}

module.exports = DiscountService;
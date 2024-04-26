const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unpublishProductByShop, searchProducts, findAllProducts, findProductById, updateProductById } = require('../repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');
const { insertInventory } = require('../repositories/inventory.repo');

class ProductFactory {
    static productRegistry = {};

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct (type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError('Invalid product type');
        return new productClass(payload).createProduct();
    }

    static updateProduct ({ product_type, product_id, ...payload }) {
        const productClass = ProductFactory.productRegistry[product_type];
        if (!productClass) throw new BadRequestError('Invalid product type');
        return new productClass(payload).updateProduct(product_id);
    }

    static async findAllDraftsForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: false };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async publishProductByShop ({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unpublishProductByShop ({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id });
    }

    static async searchProducts ({ keyword }) {
        return await searchProducts({ keyword });
    }

    static async findAllProducts ({
        limit = 50, sort = 'ctime', page = 1,
        filter = { isPublished: true },
        select = ['product_name', 'product_price', 'product_thumb'] }) {
        return await findAllProducts({ limit, sort, page, filter, select });
    }

    static async findProductById ({ product_id }) {
        return findProductById({ product_id, unSelect: ['__v'] });
    }
}

class Product {
    constructor ({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;

    }

    async createProduct (product_id) {
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: newProduct.product_shop,
                stock: newProduct.product_quantity
            })
        }
        return newProduct;
    }

    async updateProduct (productId, payload) {
        return await updateProductById({ productId, payload, model: product });
    }
}

class Clothing extends Product {
    async createProduct () {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError('Can not create new clothing');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Can not create new clothing');

        return newProduct;
    }

    async updateProduct (productId) {
        const objectParams = this;
        if (objectParams.product_attributes) {
            await updateProductById({ productId, objectParams, model: clothing });
        }

        const updatedProduct = await super.updateProduct(productId, objectParams);
        return updatedProduct;
    }
}

class Electronic extends Product {
    async createProduct () {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('Can not create new electronic');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Can not create new electronic');

        return newProduct;
    }

    async updateProduct (productId) {
        const objectParams = this;
        if (objectParams.product_attributes) {
            await updateProductById({ productId, objectParams, model: electronic });
        }

        const updatedProduct = await super.updateProduct(productId, objectParams);
        return updatedProduct;
    }
}

class Furniture extends Product {
    async createProduct () {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestError('Can not create new furniture');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Can not create new furniture');

        return newProduct;
    }

    async updateProduct (productId) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({ productId, payload: updateNestedObjectParser(objectParams.product_attributes), model: furniture });
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
        return updatedProduct;
    }
}

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
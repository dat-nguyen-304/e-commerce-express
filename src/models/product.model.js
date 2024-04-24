const { model, Schema } = require('mongoose');
const slugify = require("slugify");

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String
    },
    product_slug: {
        type: String
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    product_rating: {
        type: Number,
        default: 5,
        min: [1, 'Rating must be >= 1'],
        max: [5, 'Rating must be <= 5'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
})


const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    material: {
        type: String,
    }
}, {
    collection: 'Clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    material: {
        type: String,
    }
}, {
    collection: 'Electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    material: {
        type: String,
    }
}, {
    collection: 'Furniture',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema)
}
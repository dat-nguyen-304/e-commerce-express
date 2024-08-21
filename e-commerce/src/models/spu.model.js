const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

// Declare the Schema of the Mongo model
var spuSchema = new Schema(
  {
    product_id: { type: String, required: true, default: '' },
    product_category: { type: Array, required: true, default: [] },
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
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
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

spuSchema.index({ product_name: 'text', product_description: 'text' });

spuSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = model(DOCUMENT_NAME, spuSchema);

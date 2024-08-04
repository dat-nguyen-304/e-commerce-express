const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      default: 'fixed_amount', //or percentage
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_quantity: {
      type: Number,
      required: true,
    },
    discount_used_number: {
      type: Number,
      required: true,
    },
    discount_used_users: {
      type: Array,
      default: [],
    },
    discount_max_usage_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);

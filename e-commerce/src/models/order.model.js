const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
      totalPrice,
      totalAppliedDiscount,
      shipFee
    */
    order_shipping: { type: Object, default: {} },
    /* 
      street,
      city,
      state,
      country
    */
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000016072024' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'canceling', 'completed'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn',
    },
  },
);

module.exports = {
  cart: model(DOCUMENT_NAME, orderSchema),
};

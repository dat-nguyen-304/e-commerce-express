const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    ivt_product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    ivt_location: {
      type: String,
      default: 'unknown',
    },
    ivt_stock: {
      type: Number,
      required: true,
    },
    ivt_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    ivt_reservations: {
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
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};

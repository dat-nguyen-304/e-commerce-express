const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ['ORDER-SUCCESS', 'ORDER-FAILED', 'NEW-PROMOTION', 'NEW-PRODUCT'],
      required: true,
    },
    notification_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    notification_receiverId: { type: Number, required: true },
    notification_content: { type: String, required: true },
    notification_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, notificationSchema);

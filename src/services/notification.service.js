const Notification = require('../models/notification.model');

const pushNotificationToSystem = async ({
  type = 'ORDER-SUCCESS',
  receiverId = 1,
  senderId = 1,
  options = {},
}) => {
  let notification_content;
  if (type === 'NEW-PRODUCT') {
    notification_content = 'Shop have just added new product';
  } else if (type === 'NEW-PROMOTION') {
    notification_content = 'Shop have just added new voucher';
  }

  const newNotification = await Notification.create({
    notification_type: type,
    notification_content,
    notification_senderId: senderId,
    notification_receiverId: receiverId,
    notification_options: options,
  });
};

const listNotificationsByUser = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0,
}) => {
  const match = { notification_receiverId: userId };
  if (type !== 'ALL') match['notification_type'] = type;
  return Notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        notification_type: 1,
        notification_senderId: 1,
        notification_receiverId: 1,
        notification_content: {
          $concat: [
            {
              $substr: ['$notification_options.shop_name', 0, -1],
            },
            'have just added new product',
            {
              $substr: ['$notification_options.product_name', 0, -1],
            },
          ],
        },
        notification_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotificationToSystem,
  listNotificationsByUser,
};

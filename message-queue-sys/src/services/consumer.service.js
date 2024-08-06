const { consumerQueue, connectToRabbitMQ } = require("../dbs/rabbit.init");

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(error);
    }
  },

  consumerToNormalQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationQueue = "notificationQueue";
      const expiredTime = 12000;
      setTimeout(() => {
        channel.consume(notificationQueue, (msg) => {
          console.log(
            `Send notification successfully::`,
            msg.content.toString()
          );
          channel.ack(msg);
        });
      }, expiredTime);
    } catch (error) {
      console.error(error);
    }
  },

  consumerToFailedQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const DLXNotificationDirectExchange = "DLXNotificationDirectExchange";
      const DLXNotificationRoutingKey = "DLXNotificationRoutingKey";
      const notificationQueueHandler = "NotificationQueueHotFix";

      await channel.assertExchange(DLXNotificationDirectExchange, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        DLXNotificationDirectExchange,
        DLXNotificationRoutingKey
      );

      await channel.consume(
        queueResult.queue,
        (failedMsg) => {
          console.log(`This notification error `, failedMsg.content.toString());
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;

const { consumerQueue, connectToRabbitMQ } = require("../dbs/rabbit.init");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = messageService;

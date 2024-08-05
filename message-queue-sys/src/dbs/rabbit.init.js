const amqp = require("amqplib");
const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) throw new Error("Connection is not established");
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const connectToRabbitMQTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();
    const queue = "test-queue";
    const message = "Hello";

    await channel.assertQueue(queue);
    await channel.assertQueue(queue, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received message: ${queueName}::`, msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQTest,
  consumerQueue,
};

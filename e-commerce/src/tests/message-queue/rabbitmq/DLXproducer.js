const amqp = require('amqplib');
const messages = 'hello 123';

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const notificationDirectExchange = 'notificationDirectExchange';
    const notificationQueue = 'notificationQueue';
    const DLXNotificationDirectExchange = 'DLXNotificationDirectExchange';
    const DLXNotificationRoutingKey = 'DLXNotificationRoutingKey';

    await channel.assertExchange(notificationDirectExchange, 'direct', {
      durable: true,
    });

    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: DLXNotificationDirectExchange,
      deadLetterRoutingKey: DLXNotificationRoutingKey,
    });

    await channel.bindQueue(queueResult.queue, notificationDirectExchange);

    const msg = 'a new product';
    console.log(`producer msg::`, msg);
    channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000',
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);

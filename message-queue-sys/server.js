const { consumerToQueue } = require("./src/services/consumer.service");

const queueName = "test-topic";
consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`);
  })
  .catch(console.error);

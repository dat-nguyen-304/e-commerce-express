const {
  consumerToQueue,
  consumerToFailedQueue,
  consumerToNormalQueue,
} = require("./src/services/consumer.service");

const queueName = "test-topic";
// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer started ${queueName}`);
//   })
//   .catch(console.error);

consumerToNormalQueue(queueName)
  .then(() => {
    console.log(`Message consumerToNormalQueue started`);
  })
  .catch(console.error);

consumerToFailedQueue(queueName)
  .then(() => {
    console.log(`Message consumerToFailedQueue started`);
  })
  .catch(console.error);

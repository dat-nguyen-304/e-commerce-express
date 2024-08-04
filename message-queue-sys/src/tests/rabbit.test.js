const { connectToRabbitMQTest } = require("../dbs/rabbit.init");

describe("RabbitMQ Connection", () => {
  it("Should connect to rabbitmq success", async () => {
    const result = await connectToRabbitMQTest();
    expect(result).toBeUndefined();
  });
});

const { createClient } = require('redis');

class PubsubService {
  constructor() {
    this.client = createClient();
  }

  publish = async (channel, message) => {
    const publisher = await this.client.connect();
    publisher.publish(channel, message);
  };

  subscribe = async (channel, callback) => {
    const subscriber = await this.client.duplicate().connect();
    await subscriber.subscribe(channel, (message) => {
      callback(message);
    });
  };
}

module.exports = new PubsubService();

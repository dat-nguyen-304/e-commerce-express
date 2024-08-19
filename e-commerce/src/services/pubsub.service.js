const { createClient } = require('redis');

class PubsubService {
  constructor() {
    this.client = createClient();
  }

  publish = async (channel, message) => {
    try {
      const publisher = await this.client.connect();
      publisher.publish(channel, message);
    } catch (error) {
      console.log('Publish error', error);
    }
  };

  subscribe = async (channel, callback) => {
    try {
      const subscriber = await this.client.duplicate().connect();
      await subscriber.subscribe(channel, (message) => {
        callback(message);
      });
    } catch (error) {
      console.log('Subscribe', error);
    }
  };
}

module.exports = new PubsubService();

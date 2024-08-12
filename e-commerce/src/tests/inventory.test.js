const PubsubService = require('../services/pubsub.service.js');

class InventoryTest {
  constructor() {
    PubsubService.subscribe('purchase_event', (message) => {
      console.log({ message });
      InventoryTest.updateInventory(message);
    });
  }

  static updateInventory(message) {
    const { productId, quantity } = JSON.parse(message);
    console.log(`Update inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryTest();

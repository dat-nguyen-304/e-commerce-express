const PubsubService = require('../services/pubsub.service.js');

class InventoryTest {
  constructor() {
    PubsubService.subscribe('purchase_event', (message) => {
      console.log({ message });
      InventoryTest.updateInventory(message);
    });
  }

  static updateInventory({ productId, quantity }) {
    console.log(`Update inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryTest();

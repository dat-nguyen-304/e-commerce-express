const PubsubService = require('../services/pubsub.service.js');

class ProductTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    console.log({ productId });
    PubsubService.publish('purchase_event', JSON.stringify(order));
  }
}

module.exports = new ProductTest();

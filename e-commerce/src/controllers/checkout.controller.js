const CheckoutService = require('../services/checkout.service');
const { OK } = require('../core/success.response');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    return new OK({
      message: 'Check success',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();

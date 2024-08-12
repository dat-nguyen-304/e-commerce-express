const { OK } = require('../core/success.response');
const { uploadImageFromUrl } = require('../services/upload.service');

class UploadController {
  uploadProduct = async (req, res, next) => {
    new OK({
      message: 'Upload product image successfully',
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();

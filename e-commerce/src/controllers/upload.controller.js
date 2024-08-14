const { OK } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
} = require('../services/upload.service');

class UploadController {
  uploadProduct = async (req, res, next) => {
    new OK({
      message: 'Upload product image successfully',
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new OK({
      message: 'Upload thumbnail successfully',
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadToS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new OK({
      message: 'Upload to s3 successfully',
      metadata: await uploadImageFromLocalS3({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();

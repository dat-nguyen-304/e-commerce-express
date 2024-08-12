const cloudinary = require('../configs/cloudinary.config');

const uploadImageFromUrl = async () => {
  try {
    const imageUrl =
      'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lhnffb4u77wh10_tn.png';
    const folderName = 'product/shopId';
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
      public_id: 'testdemo',
    });
    return result;
  } catch (error) {
    console.log('Upload error', error);
  }
};

uploadImageFromUrl().catch(console.error);

module.exports = {
  uploadImageFromUrl,
};

const cloudinary = require('../configs/cloudinary.config');

//upload from url
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

//upload from local
const uploadImageFromLocal = async ({
  path,
  folderName = 'product/shopId',
}) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName,
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 8489,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.log('Upload error', error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};

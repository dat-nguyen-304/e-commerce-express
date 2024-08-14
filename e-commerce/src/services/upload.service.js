const cloudinary = require('../configs/cloudinary.config');
const { s3, PutObjectCommand } = require('../configs/s3.config');
const crypto = require('crypto');
require('dotenv').config();

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

//use s3
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomImageName = () => crypto.randomBytes(16).toString('hex');
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomImageName(),
      Body: file.buffer,
      ContentType: 'image/jpeg',
    });

    const result = await s3.send(command);
    console.log(result);
    return result;
  } catch (error) {
    console.log('Upload error', error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
};

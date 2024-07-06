const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey
      // });

      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({
        user: new Types.ObjectId(userId),
      })
      .lean();
  };

  static removeTokenById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  };

  static updateRefreshToken = async (oldRefreshToken, newRefreshToken) => {
    return await keyTokenModel.findOneAndUpdate(
      { refreshToken: oldRefreshToken },
      {
        $push: { refreshTokensUsed: oldRefreshToken },
        refreshToken: newRefreshToken,
      },
    );
  };

  static deleteKeyById = async (userId) => {
    console.log({ userId });
    return await keyTokenModel.findByIdAndDelete(userId);
  };
}

module.exports = KeyTokenService;

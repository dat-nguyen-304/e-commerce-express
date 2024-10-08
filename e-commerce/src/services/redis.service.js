const { getRedis } = require('../dbs/init.redis');
const { promisify } = require('util');
const { reservationInventory } = require('../repositories/inventory.repo');

const { instanceConnect: redisClient } = getRedis();
const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);

    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del().bind(redisClient));
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};

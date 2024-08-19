const redis = require('redis');
const { RedisError } = require('../core/error.response');
let client = {},
  statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
  };

const REDIS_RETRY_DELAY = 2000;
const REDIS_MAX_RETRY = 10;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: 'Redis connect error',
};

const handleEventConnect = (redisConnection) => {
  redisConnection
    .connect()
    .catch(() => console.log('Retry attempts exhausted'));
  redisConnection.on(statusConnectRedis.CONNECT, () => {
    console.log(`Redis connection - Connection status: Connected`);
  });

  redisConnection.on(statusConnectRedis.END, () => {
    console.log(`Redis connection - Connection status: Disconnected`);
  });

  redisConnection.on(statusConnectRedis.RECONNECT, () => {
    console.log(`Redis connection - Connection status: Reconnecting`);
  });

  redisConnection.on(statusConnectRedis.ERROR, (err) => {
    console.log(`Redis connection - Connection status: Error ${err}`);
  });
};

const initRedis = async () => {
  const redisInstance = redis.createClient({
    socket: {
      reconnectStrategy: (retries) => {
        console.log(`Reconnecting to Redis, attempt ${retries}`);
        if (retries > REDIS_MAX_RETRY) {
          return new RedisError({
            message: REDIS_CONNECT_MESSAGE.message,
            statusCode: REDIS_CONNECT_MESSAGE.code,
          });
        }
        return REDIS_RETRY_DELAY;
      },
    },
  });

  client.instanceConnect = redisInstance;
  handleEventConnect(redisInstance);
};

const getRedis = () => client;

const closeRedis = async () => {
  if (client.instanceConnect) {
    try {
      await client.instanceConnect.quit();
    } catch (err) {
      console.error('Failed to disconnect Redis client:', err);
    }
  }
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};

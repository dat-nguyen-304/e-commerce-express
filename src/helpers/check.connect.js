const mongoose = require('mongoose');
const os = require('os');

const process = require('process');

const _SECONDS = 5000;
const countConnect = () => {
  const connectionNum = mongoose.connections.length;
  console.log('Number of connections', connectionNum);
  return connectionNum;
};

const checkOverload = () => {
  setInterval(() => {
    const connectionNum = countConnect();
    const coreNum = os.cpus().length;
    const memoryusage = process.memoryUsage().rss;
    const maxConnections = coreNum * 5;
    console.log(`Active connection ${connectionNum}`);
    console.log(`Memory usage: ${memoryusage / 1024 / 1024} MB`);
    if (connectionNum > maxConnections) {
      console.log(`Connection overload detected`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};

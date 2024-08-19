const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
const { v4: uuidv4 } = require('uuid');
const myLogger = require('./loggers/my-logger.log');
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
const ProductTest = require('./tests/product.test');
require('./tests/inventory.test');
ProductTest.purchaseProduct('product:001', 10);

const app = express();

app.use(morgan('dev')); //watch log
app.use(helmet()); //hide important info such as api tech
app.use(compression()); //reduce size of data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.info(`input params: ${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query,
  ]);
  next();
});

app.use('/', require('./routes'));
app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${statusCode} - ${Date.now() - error.now}ms - response: ${JSON.stringify(error)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message },
  ]);
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;

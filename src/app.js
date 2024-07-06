const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');

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

app.use('/', require('./routes'));
app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;

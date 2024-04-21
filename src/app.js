const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");

const app = express();


app.use(morgan("dev")); //watch log
app.use(helmet()); //hide important info such as api tech
app.use(compression()); //reduce size of data
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
// checkOverload()
// app.get('/', (req, res) => {
//     const strCompress = "Hello tipjs";
//     return res.status(200).json({
//         message: "Welcome to Express",
//         metadata: strCompress.repeat(10000)
//     })
// })

app.use('/', require('./routes'));


module.exports = app;
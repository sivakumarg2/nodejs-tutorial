var express = require('express');
var products = require('./api/product/product');
var orders = require('./api/order/order');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();

//body-parser: to extract data from body. It will not support files, It will support url-encoded-data from body, json data

var uri = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(uri, {useNewUrlParser: true});
//mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Accept, Authorization, Content-Tpe');

    //OPTIONS method will be sent by browser before sending any request to check the connectivity
    //This will prevent go to router for logic in case of OPTIONS.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE')
        return res.status(200).json({});
    }
    next();
});
app.use('/products', products);

app.use('/orders', orders);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || 'Error Occurred'
        }
    })
});

module.exports = app;
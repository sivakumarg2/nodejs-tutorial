const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
//.populate("product") //it will give all of the fields of product.
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate("product", "name price")
        .exec()
        .then((result) => {
            res.status(200).send({
                orders: result
            })
        })
        .catch((err) => {
            res.status(200).send({
                message: 'No order found'
            })
        })
});

router.get('/:orderId', (req, res, next) => {
    Order.find({ _id: req.params.orderId })
        .exec()
        .then((result) => {
            res.status(200).send({
                data: result
            });
        })
        .catch((err) => {
            res.status(500).send({
                err: err
            });
        })
});

router.post('/', (req, res, next) => {
    Product.findById({ _id: req.body.productId })
        .then((result) => {
            if (result) {
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });

                return order
                    .save();
            }
            else {
                res.status(404).send({
                    message: 'No product found!!!1'
                });
            }
        })
        .then((result) => {
            res.status(200).send({
                message: "orders posted",
                ordered: result
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Product is not found",
                err: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if(result.n > 0) {
                res.status(200).send({
                    message: "orders deleted, orderId: " + req.params.orderId,
                    result:result
                });
            }
            else {
                res.status(404).send({
                    message: "Order is not available"
                });
            }
            
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })

});

module.exports = router;
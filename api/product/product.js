const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"), false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:1300/products/' + doc._id
                        }
                    }
                })
            }

            res.status(200).send({
                response
            });
        })
        .catch(err => {
            console.log("Err: ", err)
            res.status(500).send({
                err
            });
        })

});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log("File is: ", req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    console.log("Post Product")
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).send({
                message: "products post method",
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                err: err
            });
        });

});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updObs = {};
    /*/console.log(req.body);
    for (const ops of req.body) {        
        updObs[ops.propName] = ops.value;
    }

    console.log(ops);*/

    Product.update({ _id: id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(404).json({
                err: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).send({ doc });
            }
            else {
                res.status(404).send({});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err
            });
        });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec()
        .then(result => {
            console.log(result)
            res.status(200).send({ result });
        })
        .catch(err => {
            res.status(500).send({
                message: err
            });
        });
});
module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',( req, res, next) => {
    res.status(200).json({
        message: "Handling GET requests to /products"
    });
});

router.post('/', (req, res, next) => {

    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(res => console.log(res))
    .catch(err => console.log(err));

    res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: product
    });
});

router.get('/:productID',( req, res, next) => {
    const id = req.params.productID;
    if(id === "special") {
        res.status(200).json({
            message: "Special ID",
            id: id
        });
    } else {
        res.status(200).json({
            message: "nope no special ID found"
        });
    }
});

router.patch('/:productID',( req, res, next) => {
    const id = req.params.productID;
    if(id === "special") {
        res.status(200).json({
            message: "updated product",
            id: id
        });
    }
});

router.delete('/:productID',( req, res, next) => {
    const id = req.params.productID;
    if(id === "special") {
        res.status(200).json({
            message: "deleted product",
            id: id
        });
    }
});

module.exports = router;
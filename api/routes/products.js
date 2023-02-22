const express = require('express');
const router = express.Router();

router.get('/',( req, res, next) => {
    res.status(200).json({
        message: "Handling GET requests to /products"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "Handling POST requests to /products"
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
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products",
  });
});

router.post("/", (req, res, next) => {
  // const product = {
  //     name: req.body.name,
  //     price: req.body.price
  // };

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((res) => {
      res
        .status(201)
        .json({ message: "Product succesfully saved", productInfo: doc });
      console.log(res);
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
      console.log(err);
    });

  res.status(201).json({
    message: "Handling POST requests to /products",
    createdProduct: product,
  });
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res
          .status(200)
          .json({ message: "Product succesfully retrieved", productInfo: doc });
      } else {
        res
          .status(404)
          .json({
            message:
              "No product was found for the ID " + req.params.productID,
          });
      }
      console.log(doc);
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
      console.log(err);
    });

  // if(id === "special") {
  //     res.status(200).json({
  //         message: "Special ID",
  //         id: id
  //     });
  // } else {
  //     res.status(200).json({
  //         message: "nope no special ID found"
  //     });
  // }
});

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  if (id === "special") {
    res.status(200).json({
      message: "updated product",
      id: id,
    });
  }
});

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  if (id === "special") {
    res.status(200).json({
      message: "deleted product",
      id: id,
    });
  }
});

module.exports = router;

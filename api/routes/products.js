const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            // name: doc.name,
            // price: doc.price,
            // _id: doc._id,
            ...doc._doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json({ response });
      // console.log(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: err });
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
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product succesfully created",
        createdProduct: {
          // ...result._doc,
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: err,
      });
    });

  // res.status(201).json({
  //   message: "Handling POST requests to /products",
  //   createdProduct: product,
  // });
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          productInfo: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/",
          },
        });
      } else {
        res.status(404).json({
          message: "No product was found for the ID " + req.params.productID,
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
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        // result: result,
        message:'Product succesfully updated',
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // Product.update(
  //   { _id: id },
  //   { $set: { name: req.body.newName, price: req.body.newPrice } }
  // );
  // if (id === "special") {
  //   res.status(200).json({
  //     message: "updated product",
  //     id: id,
  //   });
  // }
});

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;

  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // if (id === "special") {
  //   res.status(200).json({
  //     message: "deleted product",
  //     id: id,
  //   });
  // }
});

module.exports = router;

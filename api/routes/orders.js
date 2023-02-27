const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id quantity product")
    // populate connects orders to products, so we get product details as a response rather than just productID which we posted
    // second argument to populate is the headers we want to fetch, first is all the models we want to fetch(connect/chain)
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.status(200).json({
  //   message: "orders were fetched",
  // });
});

router.post("/", (req, res, next) => {
  // const order = {
  //   productID: req.body.productID,
  //   quantity: req.body.quantity,
  // };

  const prodID = req.body.productID;

  Product.findById(prodID)
    .then((productFound) => {
      if (!productFound) {
        return res.status(404).json({ message: "Product not found" });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: prodID,
      });
      return order.save().then((result) => {
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            //it will show __v here cause ._doc has v, we cant use .select() to
            //choose what to display as we did in GET req, to not show __v, use the method used in POST req in /products
            ...result._doc,
          },
          request: {
            type: "GET",
            url: "http:/localhost:3000/orders/" + result._id,
          },
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  // res.status(201).json({
  //   message: "order was created",
  //   order: order,
  // });
});

router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.findById(id)
    .populate("product")
    .select("quantity _id product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json({
        order: order,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: "Order Details",
  //   id: id,
  // });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ message: "Order deleted succesfully", result: result });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.status(200).json({
  //   message: "Order Deleted",
  //   id: id,
  // });
});

module.exports = router;

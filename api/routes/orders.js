const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "orders were fetched",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    productID: req.body.productID,
    quantity: req.body.quantity,
  };

  res.status(201).json({
    message: "order was create",
    order: order,
  });
});

router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: "Order Details",
    id: id,
  });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: "Order Deleted",
    id: id,
  });
});

module.exports = router;

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

//connecting mongoDB, find process.env variables in nodemon.json
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://blimp:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.kp716.mongodb.net/" +
    process.env.DB_NAME +
    "?retryWrites=true&w=majority"
);

//morgan is used to log requests after nodemon starts
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling CORS errors
app.use((req, res, next) => {
  //change * to your webpage to allow only your webpage to access the api, * gives access to everyone
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message, //here it will be 'Not found'
    },
  });
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works!"
//     });
// });

module.exports = app;

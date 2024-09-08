const Product = require("../models/productModel");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  Product
    .find()
    .then((productData) => {
      res.send(productData);
    })
    .catch((err) => {
      res.send({ message: " failed Request " });
    });
});
router.get("/:id", (req, res) => {
  const id =  +req.params.id
  Product.find({id:id})
    .then((productData) => {
      res.send(productData);
    })
    .catch((err) => {
      res.send({ message: " failed Request " });
    });
});
module.exports = router;


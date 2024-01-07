// routerApi.js
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Product = require("../data/data");

router.use(express.json());

const mongoURI =
  "mongodb+srv://admin:XjlNGE7sHHPxNSbI@clustersell.qwue2wg.mongodb.net/Mongo-demo";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect Mongodb Success");
  })
  .catch((error) => {
    console.error("Error connected with MongoDB:", error);
  });

router.get("/api/products", (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      console.error("Error when query product:", error);
      res.status(500).json({ error: "Error when query product" });
    });
});

router.get("/api/products/:_id", (req, res) => {
  const _id = req.params._id;
  Product.findById(_id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    })
    .catch((error) => {
      console.error("Error getting product:", error);
      res.status(500).json({ error: "Error getting product" });
    });
});

router.post("/api/products", (req, res) => {
  const { productName, price, image, description } = req.body;

  const newProduct = new Product({
    productName,
    price,
    image,
    description,
  });

  newProduct
    .save()
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Error adding product" });
    });
});

router.delete("/api/products/:_id", (req, res) => {
  const _id = req.params._id;

  Product.deleteOne({ _id })
    .then(() => {
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Error deleting product" });
    });
});

router.put("/api/products/:_id", (req, res) => {
  const _id = req.params._id;
  const { productName, price, image, description } = req.body;

  Product.findByIdAndUpdate(
    _id,
    { productName, price, image, description },
    { new: true }
  )
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    });
});

module.exports = router;

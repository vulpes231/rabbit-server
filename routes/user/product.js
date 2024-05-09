const express = require("express");
const {
  createNewProduct,
  getProductsByName,
  addProduct,
  getAllProducts,
} = require("../../handlers/user/productController");

const router = express.Router();

router.route("/create").post(createNewProduct);
router.route("/add").post(addProduct);
router.route("/:name").get(getProductsByName);
router.route("/").get(getAllProducts);

module.exports = router;

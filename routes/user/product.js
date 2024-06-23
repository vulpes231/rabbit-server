const express = require("express");
const {
  getProductsById,
  getAllProducts,
} = require("../../handlers/user/productController");

const router = express.Router();

router.route("/").get(getAllProducts);
router.route("/:productId").get(getProductsById);

module.exports = router;

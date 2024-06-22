const express = require("express");
const {
  createNewProduct,
  getProductsById,
  deleteProduct,
  getAllProducts,
} = require("../../handlers/user/productController");

const router = express.Router();

router.route("/create").post(createNewProduct);
router.route("/delete/:productId").post(deleteProduct);
router.route("/").get(getAllProducts);
router.route("/:productId").get(getProductsById);

module.exports = router;

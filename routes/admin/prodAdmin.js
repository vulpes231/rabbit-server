const express = require("express");
const {
  createNewProduct,
  deleteProduct,
  editProduct,
  addProductFeature,
  addProductDescription,
} = require("../../handlers/admin/productAccess");

const router = express.Router();

router.route("/create").post(createNewProduct);
router.route("/edit/:productId").put(editProduct);
router.route("/addFeature/:productId").put(addProductFeature);
router.route("/addDescription/:productId").put(addProductDescription);
router.route("/delete/:productId").delete(deleteProduct);

module.exports = router;

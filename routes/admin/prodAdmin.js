const express = require("express");
const {
  createNewProduct,
  deleteProduct,
} = require("../../handlers/admin/productAccess");

const router = express.Router();

router.route("/create").post(createNewProduct);
router.route("/delete/:productId").post(deleteProduct);

module.exports = router;

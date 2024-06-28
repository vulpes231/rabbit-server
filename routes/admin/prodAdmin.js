const express = require("express");
const {
  createNewProduct,
  deleteProduct,
  editProduct,
} = require("../../handlers/admin/productAccess");

const router = express.Router();

router.route("/create").post(createNewProduct);
router.route("/edit").put(editProduct);
router.route("/delete/:productId").delete(deleteProduct);

module.exports = router;

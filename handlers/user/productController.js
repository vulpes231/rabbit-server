const Product = require("../../models/Product");

const getProductsById = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "ID parameter is required!" });
  }

  try {
    const products = await Product.findById(productId);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found with that productId." });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

module.exports = {
  getProductsById,
  getAllProducts,
};

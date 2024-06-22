const Product = require("../../models/Product");

const createNewProduct = async (req, res) => {
  const { name, price, features, description, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: "Name is required!" });
  }

  try {
    const productData = { name, category };

    // Optional fields
    if (price) productData.price = price;
    if (features) productData.features = features.toLowerCase();
    if (description) productData.description = description.toLowerCase();

    const newProduct = await Product.addProduct(productData);

    res.status(201).json({
      message: `New product ${newProduct.name} created successfully.`,
      product: newProduct,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error!" });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.deleteProductById(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({
      message: `Product ${deletedProduct.name} deleted successfully.`,
      deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

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
  createNewProduct,
  deleteProduct,
  getProductsById,
  getAllProducts,
};

const Product = require("../../models/Product");

const createNewProduct = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(404).json({ message: "forbidden access!" });
  }
  const { name, price, features, descriptions, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: "All field required!" });
  }

  try {
    const productData = { name, category, price, features, descriptions };
    const newProduct = await Product.addProduct(productData);

    res.status(201).json({
      message: `New product ${newProduct.name} created successfully.`,
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

const editProduct = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden access!" });
  }

  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: "Product ID required!" });
  }

  const { name, price, descriptions, features } = req.body;
  if (!name || !price || !descriptions || !features) {
    return res.status(400).json({ message: "All fields required!" });
  }

  try {
    const updatedProductData = {
      name,
      price,
      descriptions,
      features,
    };

    const updatedProduct = await Product.editProduct(
      productId,
      updatedProductData
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "forbidden access!" });
  }

  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: "Product ID required!" });
  }

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
    res.status(500).json({ message: "Error deleting product!" });
  }
};

const addProductFeature = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "forbidden access!" });
  }

  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: "Product ID required!" });
  }

  const { feature } = req.body;
  if (!feature) {
    return res
      .status(400)
      .json({ message: "Feature and productId are required." });
  }

  try {
    const updatedProduct = await Product.addFeature(productId, feature);
    res
      .status(200)
      .json({ message: "Feature added successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding feature!" });
  }
};

const addProductDescription = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "forbidden access!" });
  }

  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: "Product ID required!" });
  }

  const { description } = req.body;

  if (!description) {
    return res
      .status(400)
      .json({ message: "Description and productId are required." });
  }

  try {
    const updatedProduct = await Product.addDescription(productId, description);

    res.status(200).json({
      message: "Description added successfully",
      description: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding description" });
  }
};

module.exports = {
  deleteProduct,
  createNewProduct,
  editProduct,
  addProductFeature,
  addProductDescription,
};

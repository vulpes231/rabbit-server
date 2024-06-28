const Product = require("../../models/Product");

const deleteProduct = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: "forbidden access!" });
  }

  const { productId } = req.params;

  console.log(productId);

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
const editProduct = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: "forbidden access!" });
  }

  const { productId, name, price, description, category, features } = req.body;

  try {
    const updatedProductData = {
      name: name,
      price: price,
      description: description,
      category: category,
      features: features,
      inStock: true,
    };

    const updatedProduct = await Product.editProduct(
      productId,
      updatedProductData
    );
    console.log("Updated Product:", updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const createNewProduct = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(404).json({ message: "forbidden access!" });
  }
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

module.exports = { deleteProduct, createNewProduct, editProduct };

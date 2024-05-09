const Item = require("../../models/Item");
const Product = require("../../models/Product");

const createNewProduct = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required!" });
  try {
    const newProduct = await Product.create({
      name: name,
    });

    res.status(201).json({
      message: `New product ${newProduct.name} created successfully.`,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error!" });
  }
};

const addProduct = async (req, res) => {
  const { name, info, price, group } = req.body;
  if (!name || !info || !price)
    return res
      .status(400)
      .json({ message: "Name, info, and price are required!" });
  try {
    const newItem = await Item.create({
      name: name,
      info: info,
      price: price,
      group: group,
    });

    const productStore = await Product.findOne({ name: group });

    if (!productStore)
      return res.status(400).json({ message: "Invalid group!" });

    productStore.products.push(newItem);

    await productStore.save();

    console.log(productStore);

    res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

const deleteProduct = async (req, res) => {};
const editProduct = async (req, res) => {};

const getProductsByName = async (req, res) => {
  const { name } = req.params;
  if (!name) return res.status(400).json({ message: "bad request!" });
  try {
    let store = await Product.find({ name: name });

    store = store.products;

    //   console.log(store);
    return res.status(200).json({ store });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
};

module.exports = {
  createNewProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getProductsByName,
  getAllProducts,
};

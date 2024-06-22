const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: null,
  },
  features: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

productSchema.statics.findById = function (productId) {
  return this.findOne({ _id: productId });
};

productSchema.statics.findByCategory = function (category) {
  return this.find({ category: category });
};

productSchema.statics.addProduct = async function (productData) {
  try {
    const newProduct = new this(productData);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    throw error;
  }
};

productSchema.statics.deleteProductById = async function (productId) {
  try {
    const deletedProduct = await this.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

productSchema.statics.getAllProducts = function () {
  return this.find();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

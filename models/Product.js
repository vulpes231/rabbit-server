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
  descriptions: {
    type: [String],
    default: [],
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

productSchema.statics.addFeature = async function (productId, feature) {
  try {
    const product = await this.findOne({ _id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    product.features.push(feature);

    const updatedProduct = await product.save();

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

productSchema.statics.addDescription = async function (productId, description) {
  try {
    const product = await this.findOne({ _id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    product.descriptions.push(description);

    const updatedProduct = await product.save();

    return updatedProduct;
  } catch (error) {
    throw error;
  }
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

productSchema.statics.editProduct = async function (productId, updatedData) {
  try {
    const updatedProduct = await this.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

productSchema.statics.getAllProducts = function () {
  return this.find();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

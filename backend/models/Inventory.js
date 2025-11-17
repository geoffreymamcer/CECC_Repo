import mongoose from "mongoose";

const ProductListSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    availableStocks: {
      type: Number,
      required: true,
      min: 0,
    },
    stocksStatus: {
      type: String,
      enum: ["low", "in stock", "out of stock"],
      default: "in stock",
    },
    productImage: {
      type: String,
      required: false,
    },
    isPrescriptionTableRequired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Inventory", ProductListSchema);
export default Product;

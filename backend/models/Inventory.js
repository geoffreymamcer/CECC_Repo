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
      enum: [
        "prescription glasses",
        "eye drop",
        "contact lense",
        "anti radiation glasses",
        "anti blue light",
      ],
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
  },
  { timestamps: true }
);

const Product = mongoose.model("Inventory", ProductListSchema);
export default Product;

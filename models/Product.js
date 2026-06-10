import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "No Brand",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Blazers",
        "Casual Shirts",
        "Formal Shirts",
        "Kurtas",
        "T-Shirts",
        "Trousers",
        "Shirts",
        "Hoodies",
        "Jeans",
        "Jackets",
        "Suits",
        "Sarees",
        "Shorts",
        "Sweatshirts",
        "Lehengas",
      ],
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    sizes: {
      type: [String], // ["S", "M", "L", "XL"]
      default: [],
    },

    colors: {
      type: [String], // ["Red", "Blue"]
      default: [],
    },

    image: {
      type: [String],
      required: true,
    },

      public_id: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Women",
    },  
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;

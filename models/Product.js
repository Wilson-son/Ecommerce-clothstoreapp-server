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
      type: [String],
      default: [],
    },

    color: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      hex: {
        type: String,
        required: true,
        trim: true,
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Women",
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ category: 1, brand: 1, price: 1 });
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;

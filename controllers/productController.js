import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      countInStock: req.body.stock,
      images: req.body.images || [],
    });

    console.log("Created Product:", product);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filters
    if (category && category !== "All") query.category = category;
    if (brand && brand !== "All") query.brand = brand;
    if (size) query.sizes = { $in: [size] };
    if (color) {
      const colors = color.split(",");

      query["color.name"] = {
        $in: colors,
      };
    }
    if (search) query.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductVariants = async (req, res) => {
  try {
    let { name, brand, category, gender } = req.query;

    if (!name || !brand) {
      return res.status(400).json({
        success: false,
        message: "name and brand are required",
      });
    }

    //
    const escapeRegex = (str) =>
      decodeURIComponent(str)
        .replace(/\+/g, " ")
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    console.log(
      "Searching variants for:",
      escapeRegex(name),
      escapeRegex(brand),
    );

    const variants = await Product.find({
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
      brand: { $regex: `^${escapeRegex(brand)}$`, $options: "i" },
      ...(category && { category }),
      ...(gender && { gender }),
    }).select("_id name color images price countInStock sizes");

    console.log("Found variants:", variants.length);

    res.status(200).json({ success: true, variants });
  } catch (error) {
    console.error("Variants error:", error.message); // ← shows exact crash reason
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let updatedData = {
      ...req.body,
      countInStock: req.body.stock,
    };

    if (
      req.body.public_id &&
      req.body.public_id !== product.images?.[0]?.public_id
    ) {
      if (product.images?.[0]?.public_id) {
        await cloudinary.uploader.destroy(product.images[0].public_id);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all images from Cloudinary (fast + parallel)
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) =>
          img.public_id ? cloudinary.uploader.destroy(img.public_id) : null,
        ),
      );
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

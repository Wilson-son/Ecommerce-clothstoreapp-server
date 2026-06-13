import express from "express";

import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductVariants, 
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";   

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/variants", getProductVariants); 
router.get("/:id", getProduct);


// Admin Routes
router.post("/", protect, adminOnly, createProduct);

router.put("/:id", protect, adminOnly, updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
    
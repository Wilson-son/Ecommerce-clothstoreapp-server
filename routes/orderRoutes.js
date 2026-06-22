import express from "express";
import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Payment 
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/", protect, createOrder);

//  User orders

router.get("/my-orders", protect, getMyOrders);

//  Admin orders 
//
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

//  Single order (by ID) 
//
router.get("/:id", protect, getOrderById);

export default router;
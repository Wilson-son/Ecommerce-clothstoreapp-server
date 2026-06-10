import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


import {
  getAllUsers,
  getDashboardStats,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();


router.get("/stats", protect, adminOnly, getDashboardStats);


router.get("/users", protect, adminOnly, getAllUsers);


router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
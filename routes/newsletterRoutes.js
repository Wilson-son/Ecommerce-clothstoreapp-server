import express from "express";
import {
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/newsletterController.js";

const router = express.Router();

// Public route
router.post("/", subscribeNewsletter);

// Admin routes
router.get("/", getSubscribers);
router.delete("/:id", deleteSubscriber);

export default router;
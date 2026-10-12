import express from "express";

import {
  getDeliveries,
  createDelivery,
  updateDelivery
} from "../controllers/deliveryController.js";

const router = express.Router();

// GET /api/deliveries
router.get("/", getDeliveries);

// POST /api/deliveries
router.post("/", createDelivery);

// PUT /api/deliveries/:id
router.put("/:id", updateDelivery);

export default router;
import express from "express";

import {
  getCustomers,
  createCustomer,
  updateCustomer
} from "../controllers/customerController.js";

const router = express.Router();

// GET /api/customers
router.get("/", getCustomers);

// POST /api/customers
router.post("/", createCustomer);

// PUT /api/customers/:id
router.put("/:id", updateCustomer);

export default router;
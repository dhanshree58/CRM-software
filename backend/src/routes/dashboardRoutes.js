import express from "express";

import {
  getDashboard,
  getReports
} from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", getDashboard);

// GET /api/dashboard/reports
router.get("/reports", getReports);

export default router;
import express from "express";
import { searchJobs } from "../controllers/job.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Defines the endpoint: GET /api/jobs/search
// The 'protect' middleware ensures only authenticated users can access this route.
router.get("/search", searchJobs);

export default router;

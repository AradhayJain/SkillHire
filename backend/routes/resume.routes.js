import express from "express"
import {
    uploadResume,
    updateResume,
    updateAtsScore,
    updateAnalyticsData,
    getResumes
} from "../controllers/resume.controller.js";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload",protect, upload.single("resume"), uploadResume);
router.put("/:resumeId", protect, updateResume);
router.put("/:resumeId/ats-score", protect, updateAtsScore);
router.put("/:resumeId/analytics", protect, updateAnalyticsData);
router.get("/", protect, getResumes);

export default router;
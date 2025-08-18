import express from "express"
import {
    uploadResume,
    updateResume,
    getAtsScore,
    getAnalyticsData,
    getResumes,
    deleteResume
} from "../controllers/resume.controller.js";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload",protect, upload.single("resume"), uploadResume);
router.put("/:resumeId", protect,upload.single("resume"), updateResume);
router.put("/:resumeId/ats-score", protect, getAtsScore);
router.put("/:resumeId/analytics", protect, getAnalyticsData);
router.get("/", protect, getResumes);
router.delete("/:resumeId", protect, deleteResume);

export default router;
import express from 'express';
import { getGeminiResponse } from '../controller/Gemini.controller.js';
const router = express.Router();
router.post('/response',getGeminiResponse);
export default router;
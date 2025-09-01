import express from 'express';
import { getGem, getGeminiResponse } from '../controller/Gemini.controller.js';
const router = express.Router();
router.post('/response',getGeminiResponse);
router.post('/gem',getGem);
export default router;
import express from "express"
import { support } from "../controllers/support.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/get-support',protect,support);

export default router;
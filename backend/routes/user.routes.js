import express from "express"
import { registerUser,loginUser,allUsers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, allUsers);

export default router;
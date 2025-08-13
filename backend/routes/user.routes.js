import express from "express"
import { registerUser,loginUser,allUsers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.post("/register", (req, res, next) => {
    upload.single("pic")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }
      next();
    });
}, registerUser);
router.post("/login", loginUser);
router.get("/", protect, allUsers);

export default router;
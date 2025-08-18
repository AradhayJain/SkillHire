import express from "express"
import { 
    registerUser,
    loginUser,
    allUsers,
    googleAuth,
    forgotPassword,
    resetPassword, 
    registerRequestOtp,
    registerVerifyOtp
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// --- Registration, Login, and Search ---
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

// --- Google OAuth ---
router.post("/google-auth", googleAuth);

// --- Password Reset ---
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.post("/register-verify-otp", registerVerifyOtp);
router.post("/register-request-otp", upload.single("pic"), registerRequestOtp);


export default router;

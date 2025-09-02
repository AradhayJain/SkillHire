// middleware/uploadMiddleware.js
import multer from "multer";
import fs from "fs";

// Create uploads folder if it doesn't exist
const uploadDir = "backend/uploads/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
// Set storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        
        cb(null,file.originalname);
    },
});

// Multer upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

export default upload;

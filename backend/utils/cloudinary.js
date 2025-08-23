import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// --- Configuration (Should be at the top level of your app) ---
// Make sure you have this configured somewhere before you call these utils
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });


// --- UPLOAD FUNCTION (You already have this) ---
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",  // Detect file type automatically
      use_filename: true,
      unique_filename: false,
      folder: "Resumes_Skillhire" // 👈 this puts the file inside the folder
    });

    fs.unlinkSync(localFilePath);
    return response; // contains public_id like "resumes_skillhire/yourFileName"
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};


// --- DELETE FUNCTION (Add this part) ---
export const deleteFromCloudinary = async (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl) return null;
    console.log(cloudinaryUrl)

    // Extract public_id from URL
    // Handles nested folders and ignores version number
    const parts = cloudinaryUrl.split("/upload/")[1].split("/");
    parts.shift(); // remove the version (e.g., v1234567890)
    const publicIdWithExt = parts.join("/");
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) || publicIdWithExt;

    // Delete the asset
    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary deletion result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};



// --- EXPORTS (Update your exports) ---
export default uploadOnCloudinary;
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
      unique_filename: true,
      folder: "Resumes_Skillhire"
    });
    console.log("Cloudinary Upload Response:", response);

    fs.unlinkSync(localFilePath);
    return response; // contains public_id like "resumes_SkillSnap/yourFileName"
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
    console.log("Deleting:", cloudinaryUrl);

    // Extract public_id
    const parts = cloudinaryUrl.split("/upload/")[1].split("/");
    parts.shift(); // remove version (e.g., v1234567890)
    const publicIdWithExt = parts.join("/");
    const publicId =
      publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) ||
      publicIdWithExt;

    // Detect resource type from URL
    let resourceType = "image";
    if (cloudinaryUrl.includes("/raw/")) resourceType = "raw";
    if (cloudinaryUrl.includes("/video/")) resourceType = "video";

    // Delete the asset
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Cloudinary deletion result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};




// --- EXPORTS (Update your exports) ---
export default uploadOnCloudinary;
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading file:", localFilePath);
    console.log("File size (bytes):", fs.statSync(localFilePath).size);

    // Always use auto detection for resource type
    const response = await cloudinary.uploader.upload(localFilePath, {
      use_filename: true,
      unique_filename: false
    });

    fs.unlinkSync(localFilePath); // cleanup local file after upload
    return response.url; // return direct usable URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Cleanup even if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (cleanupErr) {
      console.error("Error cleaning up local file:", cleanupErr);
    }
    return null;
  }
};

export default uploadOnCloudinary;

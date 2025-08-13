import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading file:", localFilePath);
    console.log("File size (bytes):", fs.statSync(localFilePath).size);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
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

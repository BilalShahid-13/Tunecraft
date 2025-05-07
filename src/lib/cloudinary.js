import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensure secure URLs (https)
});

// Function to upload file buffer to Cloudinary
export async function uploadFile(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw", // Auto detect file type (e.g., PDF, images)
      },
      (error, result) => {
        if (result) resolve(result); // Successful upload
        else reject(error); // Handle error
      }
    );

    // End the stream with the file buffer
    uploadStream.end(fileBuffer);
  });
}

export default cloudinary;

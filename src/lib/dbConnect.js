import mongoose from "mongoose";

export const dbConnect = async () => {
  // Check if the connection is already open
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Connect to MongoDB without the deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Let the caller handle the error
  }
};

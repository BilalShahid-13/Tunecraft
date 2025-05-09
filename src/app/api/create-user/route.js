import { uploadFile } from "@/lib/cloudinary";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const formData = await request.formData();

  const email = formData.get("email");
  const username = formData.get("username");
  const role = formData.get("role");
  const phone = formData.get("phone");
  const musicTemplate = formData.get("musicTemplate");
  const file = formData.get("cv");

  try {
    // Check for missing required fields
    if (!email || !role || !username || !phone || !file) {
      return NextResponse.json(
        { msg: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { msg: "User already exists", success: false },
        { status: 400 }
      );
    }
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadFile(buffer, "/Tunecraft/cv");
    await dbConnect();
    const newUser = await new User({
      email,
      username,
      role,
      phone,
      musicTemplate,
      cv: res.secure_url,
    });
    await newUser.save();

    // Extract the URLs from Cloudinary response
    const secure_url = res.secure_url; // Secure URL is usually the preferred one

    console.log("Upload successful, URL:", secure_url);

    // Return success response with Cloudinary URL
    return NextResponse.json(
      {
        msg: "User created successfully",
        success: true,
        data: { secure_url },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { msg: error.message, success: false },
      { status: 500 }
    );
  }
}

import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const { id, password, email, phone, username } = await request.json();

    // Ensure all required fields are provided
    // if (!id || (!password && !email && !phone && !username)) {
    //   return NextResponse.json(
    //     { error: "All fields are required" },
    //     { status: 400 }
    //   );
    // }

    // Ensure DB connection
    await dbConnect();

    // Look up user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the update payload
    let updatePayload = {};
    console.log(id, password, email, phone, username);
    // Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updatePayload.password = hashedPassword;
    }

    // Update the email if provided
    if (email) {
      updatePayload.email = email;
    }

    // Update the phone if provided
    if (phone) {
      updatePayload.phone = phone;
    }

    // Update the username if provided
    if (username) {
      updatePayload.username = username;
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    // Return success response with updated user data
    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

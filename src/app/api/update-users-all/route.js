import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const { id, password, email, phone, username } = await request.json();

    if (!id || !password || !email || !phone || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          phone,
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/verify-otp/route.js
import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user by email and matching OTP, ensure it's not expired
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "OTP is invalid or has expired." },
        { status: 400 }
      );
    }
    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Verify-OTP error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

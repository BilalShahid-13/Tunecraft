// app/api/forgot-password/route.js
import { dbConnect } from "@/lib/dbConnect";
import { forgotPassword } from "@/lib/emailTemplates";
import User from "@/Schema/User";
import { sendMail } from "@/utils/emailService";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1) Connect to the database
    await dbConnect();

    // 2) Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found for that email" },
        { status: 404 }
      );
    }

    // 3) Generate a 6-digit OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const { html, subject } = forgotPassword(otp);
    // 4) Send the OTP via email
    await sendMail(subject, html);

    // 5) Return success
    return NextResponse.json(
      { message: "Reset code sent to your email.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot-password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

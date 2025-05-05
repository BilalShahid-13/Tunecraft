// app/api/forgot-password/route.js
import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // 4) Send the OTP via email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      to: user.email,
      from: process.env.GOOGLE_APP_USER,
      subject: "Your Password Reset Code",
      html: `<p>Your password reset code is <strong>${otp}</strong>. It expires in 1 hour.</p>`,
    });

    // 5) Return success
    return NextResponse.json(
      { message: "Reset code sent to your email.",user },
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

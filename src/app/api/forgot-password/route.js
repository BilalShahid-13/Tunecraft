// // api/forgot-password.js
// import User from "@/Schema/User";
// import bcrypt from "bcryptjs";
// import { sendMail } from "@/lib/mail"; // Make sure you have an email service
// import crypto from "crypto";

// export async function POST(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { email } = req.body;

//   try {
//     // Find the user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate a reset token and set expiration
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

//     user.resetToken = resetToken;
//     user.resetTokenExpire = resetTokenExpire;

//     await user.save();

//     // Send reset email
//     const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
//     const message = `Click this link to reset your password: ${resetUrl}`;

//     await sendMail({
//       to: email,
//       subject: "Password Reset Request",
//       text: message,
//     });

//     return res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }

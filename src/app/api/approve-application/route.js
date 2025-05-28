import { dbConnect } from "@/lib/dbConnect";
import { userApproved } from "@/lib/emailTemplates";
import { sendMail } from "@/utils/emailService";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/Schema/User";
import Order from "@/Schema/Order";
export async function PATCH(request) {
  const { id, password, email, username } = await request.json();

  if (!id || !password || !email || !username) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { approvalStatus: "approved", password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 }
      );
    }

    // to make sure all orders will go to lyricist dashboard
    if (updatedUser.role === "lyricist") {
      try {
        const order = await Order.updateMany(
          {
            "crafters.lyricist.assignedCrafterId": null, // 🧠 Target only unassigned orders
          },
          {
            $set: {
              "crafters.lyricist.assignedCrafterId": updatedUser._id,
              "crafters.lyricist.submissionStatus": "available",
              currentStage: "lyricist",
            },
          }
        );
      } catch (error) {
        return NextResponse.json(
          { error: "Error updating orders", error: error.message },
          { status: 500 }
        );
      }
    }
    // order.

    try {
      const { html, subject, to } = userApproved(username, email, password);
      const info = await sendMail(subject, html, to);

      return NextResponse.json({
        message: "User approved successfully",
        success: true,
        data: info,
      });
    } catch (mailError) {
      return NextResponse.json({ error: mailError.message }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

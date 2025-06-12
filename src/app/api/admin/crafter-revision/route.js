import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function POST(res) {
  const { orderId, crafterId, role, adminFeedback } = await res.json();
  if (!orderId || !crafterId || !role || !adminFeedback) {
    return NextResponse.json(
      { error: "orderId and crafterId and role are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const revisionQuery = `crafters.${role}.revisionAttempts`;
    const adminFeedbackQuery = `crafters.${role}.adminFeedback`;
    const penaltyQuery = "penaltyCount"; // Use a direct field name (penaltyCount)
    const crafterQuery = `crafters.${role}.assignedCrafterId`;
    const submissionStatusQuery = `crafters.${role}.submissionStatus`;

    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      [crafterQuery]: crafterId,
    });

    // Find the user (crafter)
    const user = await User.findOne({ _id: crafterId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get the revision attempts and penalty count
    const revisionAttempts = order.get(revisionQuery); // Using `.get()` to access dynamic field
    const penaltyCount = user.penaltyCount || 0; // Accessing the penaltyCount directly from the user object
    if (revisionAttempts === 1) {
      return NextResponse.json(
        { message: "Already allowed revision" },
        { status: 404 }
      );
    }

    // Increment penalty count
    order.currentStage = role;
    order.set(submissionStatusQuery, "rejected");

    // Increment penalty count directly
    user.set(penaltyQuery, penaltyCount + 1); // Increment penaltyCount by 1

    // Set revisionAttempts to 1 and save the order
    order.set(revisionQuery, 1); // Update the revisionAttempts field
    if (adminFeedback) {
      order.set(adminFeedbackQuery, adminFeedback); // Set the admin feedback
    }

    // Save the updated order and user
    await order.save();
    await user.save(); // Don't forget to save the user after updating penaltyCount

    return NextResponse.json({
      message: "Order found and updated successfully",
      data: order,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Payment from "@/Schema/Payment";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { orderId, role, prevRole, paymentId } = await req.json();

  // Ensure all necessary fields are provided
  if (!orderId || !role || !prevRole || !paymentId) {
    return NextResponse.json(
      { error: "orderId, role, prevRole, and paymentId are required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnect();

    // Find the order and payment
    const order = await Order.findById(orderId);
    const payment = await Payment.findOne({ _id: paymentId });

    // If the payment doesn't exist, return an error
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status to completed
    payment.paymentStatus = "completed";
    await payment.save();

    // Check if the role is "done", which means the order is complete
    if (role === "done") {
      if (order) {
        order.currentStage = "done";
        order.orderStatus = "completed";

        // Ensure that the crafter for the given role exists
        if (order.crafters[role]) {
          order.crafters[role].submissionStatus = "approved";
        } else {
          return NextResponse.json(
            { error: `Crafter role ${role} not found` },
            { status: 404 }
          );
        }

        await order.save();
        return NextResponse.json({ message: "Order completed successfully" });
      } else {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } else {
      // Update the order when the role isn't "done"
      if (order) {
        // Check if the crafter for the given role exists
        if (order.crafters[role] && order.crafters[prevRole]) {
          order.currentStage = role;
          order.crafters[role].submissionStatus = "available"; // Set current role to available
          order.crafters[prevRole].submissionStatus = "approved"; // Mark previous role as approved
        } else {
          return NextResponse.json(
            { error: `Crafter roles ${role} or ${prevRole} not found` },
            { status: 404 }
          );
        }

        await order.save();
        return NextResponse.json({ message: "Order updated successfully" });
      } else {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }
  } catch (error) {
    // Log the error and return the error message
    console.error("Approval error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

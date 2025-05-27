import { uploadFile } from "@/lib/cloudinary";
import { currentStageEnum, submissionStatusEnum } from "@/lib/Constant";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("submissionFile");
    const comments = formData.get("comments");
    const role = formData.get("role");
    const orderId = formData.get("orderId");
    const crafterId = formData.get("crafterId");

    // Basic validations
    if (!role || !orderId || !crafterId) {
      return NextResponse.json(
        { error: "Role, Order ID, and Crafter ID are required" },
        { status: 400 }
      );
    }
    if (!files?.length) {
      return NextResponse.json(
        { error: "At least one submissionFile is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(crafterId);
    if (!user) {
      return NextResponse.json({ error: "Crafter not found" }, { status: 404 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check
    const assigned = order.crafters[role];
    if (
      !assigned.assignedCrafterId ||
      assigned.assignedCrafterId.toString() !== crafterId
    ) {
      return NextResponse.json(
        { error: "You are not assigned to this role" },
        { status: 403 }
      );
    }

    // Deadline check: 3 hours from assignedAtTime
    const assignedAt = new Date(assigned.assignedAtTime);
    const now = new Date();
    const deadline = new Date(assignedAt.getTime() + 3 * 60 * 60 * 1000);
    if (now > deadline) {
      return NextResponse.json(
        { error: "Submission time is over. You missed the 3-hour deadline." },
        { status: 400 }
      );
    }

    // Upload each file to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const path = `/Tunecraft/submissionFiles/${role}/${user.username},${order._id}`;
      const res = await uploadFile(buffer, path);
      return res.secure_url;
    });

    const secureUrls = await Promise.all(uploadPromises);

    // Update order document
    order.currentStage = `review_${role}`;
    order.crafters[role].submissionStatus = submissionStatusEnum[3]; // "submitted"
    order.crafters[role].submittedAtTime = now;
    // Save array of URLs or single URL if only one
    order.crafters[role].submittedFileUrl = secureUrls;
    order.crafters[role].adminFeedback = comments;

    await order.save();

    return NextResponse.json(
      { message: "Task submitted successfully", urls: secureUrls },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

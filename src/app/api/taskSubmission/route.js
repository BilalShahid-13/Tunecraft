import { uploadFile } from "@/lib/cloudinary";
import { currentStageEnum, submissionStatusEnum } from "@/lib/Constant";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("submissionFile");
  const comments = formData.get("comments");
  const role = formData.get("role");
  const orderId = formData.get("orderId");
  const crafterId = formData.get("crafterId");

  if (!file || !role) {
    return NextResponse.json(
      { error: "File and role are required" },
      { status: 400 }
    );
  }

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadFile(buffer, "/Tunecraft/submissionFiles");

    const task = await Order.findById(orderId);
    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      !task.crafters[role].assignedCrafterId ||
      task.crafters[role].assignedCrafterId.toString() !== crafterId
    ) {
      return NextResponse.json(
        { error: "You are not assigned to this role" },
        { status: 403 }
      );
    }
    const assignedAt = new Date(task.crafters[role].assignedAtTime);
    const now = new Date();

    // Calculate submission deadline: 3 hours after assignedAtTime
    const submissionDeadline = new Date(
      assignedAt.getTime() + 3 * 60 * 60 * 1000
    );

    if (now > submissionDeadline) {
      return NextResponse.json(
        { error: "Submission time is over. You missed the 3-hour deadline." },
        { status: 400 }
      );
    }

    task.currentStage = `review_${role}`;
    // task.currentStage = currentStageEnum[2];
    task.crafters[role].submissionStatus = submissionStatusEnum[3]; // "submitted"
    task.crafters[role].submittedAtTime = new Date(); // "submitted"
    task.crafters[role].submittedFileUrl = res.secure_url;
    task.crafters[role].adminFeedback = comments;

    await task.save();

    return NextResponse.json(
      { message: "Task submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

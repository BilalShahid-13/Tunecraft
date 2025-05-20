import Plan from "@/Schema/Plan"; // <-- add this import to register the model
import Order from "@/Schema/Order";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role } = await req.json();
    console.log("role", role);
    await dbConnect();
    const query = `crafters.${role}.submissionStatus`;
    const tasks = await Order.find({
      [query]: "available",
      currentStage: role,
    }).populate({
      path: "plan",
    });
    return NextResponse.json({
      message: "Data fetch successfully",
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

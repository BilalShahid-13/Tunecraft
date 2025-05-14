import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Order.find({}).populate({
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

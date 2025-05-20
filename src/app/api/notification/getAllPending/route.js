import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await User.find({ approvalStatus: "pending" });
    return NextResponse.json({
      message: "Data fetch successfully",
      data: notifications,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

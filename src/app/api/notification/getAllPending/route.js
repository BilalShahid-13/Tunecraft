import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await User.find({
      approvalStatus: { $exists: true, $ne: null },
      role: { $ne: "admin" },
    });
    return NextResponse.json({
      message: "Data fetch successfully",
      data: notifications,

    },{ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

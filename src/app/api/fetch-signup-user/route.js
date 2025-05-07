import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    // Fetch users where role is not 'admin'
    const users = await User.find({ role: { $ne: "admin" } }); // `$ne` stands for "not equal"

    return NextResponse.json({
      message: "Data fetch successfully",
      data: users,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

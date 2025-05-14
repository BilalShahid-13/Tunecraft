import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found or delete failed" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

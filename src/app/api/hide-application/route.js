import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    await dbConnect();

    // Find one user where the role is not 'admin' and update their userStatus to 'rejected'
    const user = await User.findOneAndUpdate(
      {
        role: { $ne: "admin" }, // Exclude admins
        $or: [
          { userStatus: { $ne: "rejected" } }, // Only update if not already rejected
          { userStatus: { $exists: false } }, // If userStatus does not exist, update it
        ],
      },
      { userStatus: "rejected" }, // Update userStatus to 'rejected'
      { new: true } // Return the updated document
    );

    if (!user) {
      return NextResponse.json({
        message: "No matching user found to update",
      });
    }

    return NextResponse.json({
      message: "User status updated to 'rejected' successfully",
      data: user, // Return the updated user
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

// ❗ NO default export, export POST directly
export async function POST(request) {
  try {
    const { email, password, role, username,clerkId } = await request.json(); // ✅ request.json(), not request.request.json()

    if (!email || !password || !role || !username || !clerkId) {
      return NextResponse.json(
        { msg: "All fields are required", success: false },
        { status: 400 }
      );
    }
    await dbConnect(); // ✅ connect to MongoDB
    const userFind = await User.findOne({ email });
    if (userFind) {
      return NextResponse.json(
        { msg: "User already exists", success: false },
        { status: 400 }
      );
    }

    const response = new User({
      clerkId,
      email,
      password,
      role,
      username,
    });

    await response.save(); // ✅ password auto-hashed if your schema has pre-save hook

    return NextResponse.json(
      { msg: "User created successfully", success: true },
      { status: 200 } // ✅ correct way to set status
    );
  } catch (error) {
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}

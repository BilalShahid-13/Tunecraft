// app/api/user/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // your mongoose connect util
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/Schema/User";

export async function PATCH(request) {
  // 1. ensure DB connection
  await dbConnect();

  // 2. auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. parse incoming data
  const { fullName, currentPassword, newPassword, email } =
    await request.json();

  let msg = null;
  // 4. lookup user
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let didUpdate = false;

  // 5. handle name update
  if (fullName) {
    user.fullName = fullName;
    didUpdate = true;
    msg = 'username updated successfully';
  }

  if (email) {
    user.email = email;
    didUpdate = true;
    msg = 'email updated successfully';
  }

  // 6. handle password update
  if (newPassword) {
    // verify current
    if (
      !currentPassword ||
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    // hash & set new
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    didUpdate = true;
    msg = 'password updated successfully';
  }

  if (!didUpdate) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  // 7. save and return success
  await user.save();
  return NextResponse.json({ message: msg });
}

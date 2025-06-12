// app/api/fetch-payment/route.js
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/Schema/Payment";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { crafterId, crafterRole } = await req.json();
  if (!crafterId || !crafterRole) {
    return NextResponse.json(
      { error: "crafterId and crafterRole are required" },
      { status: 400 }
    );
  }
  await dbConnect();
  const payments = await Payment.find({ crafterId, crafterRole })
    .populate({
      path: "plan", // Populate the plan reference
      model: "Plan",
    })
    .populate({
      path: "orderId", // Populate the orderId reference
      model: "Order",
      select: "orderId songGenre musicTemplate createdAt", // Select only the orderId field, exclude _id
    })
    .populate({
      path: "crafterId", // Populate the orderId reference
      model: "User",
      select: "username email phone", // Select only the orderId field, exclude _id
    })
    // .select("assignedDate crafterRole paymentStatus projectName"); // Only return these fields for Payment

  return NextResponse.json({ data: payments }, { status: 200 });
}

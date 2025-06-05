// app/api/cron/check-extensions/route.js
import Order from "@/Schema/Order";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔄 Checking expired extensions...");

    // Connect to DB
    await dbConnect();

    // Get all orders where any crafter extension is granted and expired
    const orders = await Order.find({
      $or: [
        {
          "crafters.lyricist.extension.granted": true,
          "crafters.lyricist.extension.until": { $lt: new Date() },
        },
        {
          "crafters.singer.extension.granted": true,
          "crafters.singer.extension.until": { $lt: new Date() },
        },
        {
          "crafters.engineer.extension.granted": true,
          "crafters.engineer.extension.until": { $lt: new Date() },
        },
      ],
    });

    console.log(`📋 Found ${orders.length} orders with expired extensions`);

    let processedCount = 0;

    // Iterate over all orders
    for (let order of orders) {
      let orderModified = false;

      for (let role in order.crafters) {
        const crafter = order.crafters[role];

        // Check if extension exists before accessing properties
        if (crafter.extension) {
          if (
            crafter.extension.granted &&
            new Date(crafter.extension.until) < new Date()
          ) {
            console.log(
              `⏰ Processing expired extension for ${role} in order ${order.orderId}`
            );

            // Reset crafter data if the extension window expired
            crafter.rejectedCrafters = [
              ...crafter.rejectedCrafters,
              crafter.assignedCrafterId,
            ];
            crafter.assignedAtTime = null;
            crafter.assignedCrafterId = null;
            crafter.submissionStatus = "available";
            crafter.extension.granted = false;
            crafter.extension.until = null;
            crafter.penaltyCount = (crafter.penaltyCount || 0) + 1;

            orderModified = true;
            processedCount++;

            console.log(
              `✅ Submission cancelled for crafter ${crafter.assignedCrafterId}, penalty count now: ${crafter.penaltyCount}`
            );
          }
        } else {
          console.log(
            `⚠️ No extension found for role ${role} in order ${order.orderId}`
          );
        }
      }

      // Only save if order was modified
      if (orderModified) {
        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} expired extensions`,
      processedCount,
    });
  } catch (err) {
    console.error("❌ Error in checking expired extensions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

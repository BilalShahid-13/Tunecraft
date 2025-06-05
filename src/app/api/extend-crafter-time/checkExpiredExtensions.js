"use server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import cron from "node-cron";

export const checkExpiredExtensions = async () => {
  try {
    // Connect to DB
    await dbConnect();

    // Get all orders where extension is granted
    const orders = await Order.find({
      "crafters.extension.granted": true,
      "crafters.extension.until": { $lt: new Date() }, // where the extension time has expired
    });

    // Iterate over all orders
    for (let order of orders) {
      for (let role in order.crafters) {
        const crafter = order.crafters[role];

        if (
          crafter.extension.granted &&
          new Date(crafter.extension.until) < new Date()
        ) {
          crafter.rejectedCrafters = [
            ...crafter.rejectedCrafters,
            crafter.assignedCrafterId,
          ];
          crafter.assignedAtTime = null;
          crafter.assignedCrafterId = null;
          crafter.submissionStatus = "available";
          crafter.penaltyCount = (crafter.penaltyCount || 0) + 1;

          // Mark the nested field as modified
          order.markModified(`crafters.${role}`);

          await order.save();
          console.log(
            `Submission cancelled for crafter ${crafter.assignedCrafterId}, extension expired. Penalty count: ${crafter.penaltyCount}`
          );
        }
      }
    }
  } catch (err) {
    console.error("Error in checking expired extensions:", err);
  }
};

// Schedule the cron job to run every minute
cron.schedule("* * * * *", checkExpiredExtensions); // Every minute

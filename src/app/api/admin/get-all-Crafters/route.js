import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Find orders where any crafter has a submissionStatus of "submitted" or "approved"
    const orders = await Order.find({
      $or: [
        {
          "crafters.lyricist.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
        {
          "crafters.singer.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
        {
          "crafters.engineer.submissionStatus": {
            $in: ["submitted", "approved"],
          },
        },
      ],
    }).populate([
      "crafters.lyricist.assignedCrafterId",
      "crafters.singer.assignedCrafterId",
      "crafters.engineer.assignedCrafterId",
      { path: "plan", model: Plan },
    ]);

    // For each order, gather all crafters whose status is "submitted" or "approved"
    const formattedOrders = orders.flatMap((orderDoc) => {
      const order = orderDoc.toObject();
      const roles = ["lyricist", "singer", "engineer"];
      const matchedCrafters = [];

      roles.forEach((role) => {
        const crafterSub = order.crafters[role];
        if (
          crafterSub &&
          ["submitted", "approved"].includes(crafterSub.submissionStatus)
        ) {
          matchedCrafters.push({
            role,
            crafterFeedback: crafterSub.crafterFeedback,
            _id: order._id,
            orderId: order.orderId,
            name: order.name,
            phone: order.phone,
            email: order.email,
            songGenre: order.songGenre,
            jokes: order.jokes,
            revisionAttempts: crafterSub.revisionAttempts,
            penaltyCount: crafterSub.penaltyCount,
            extension: crafterSub.extension,
            backgroundStory: order.backgroundStory,
            plan: order.plan, // populated Plan document
            payment: order.payment, // populated Payment document
            musicTemplate: order.musicTemplate,
            currentStage: order.currentStage,
            orderStatus: order.orderStatus,
            finalSongUrl: order.finalSongUrl, // populated Final Song URL
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            assignedCrafterId: crafterSub.assignedCrafterId, // Populated User document
            submissionStatus: crafterSub.submissionStatus,
            submittedFile: crafterSub.submittedFile,
            submittedAtTime: crafterSub.submittedAtTime,
            crafterUsername: crafterSub.assignedCrafterId?.username,
            crafterEmail: crafterSub.assignedCrafterId?.email,
          });
        }
      });

      return matchedCrafters; // Return array of crafters for flattening
    });

    return NextResponse.json(
      {
        message: "Fetched all orders with submitted or approved crafters",
        data: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

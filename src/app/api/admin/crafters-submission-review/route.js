import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import User from "@/Schema/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({
      $or: [
        { "crafters.lyricist.submissionStatus": "submitted" },
        { "crafters.singer.submissionStatus": "submitted" },
        { "crafters.engineer.submissionStatus": "submitted" },
      ],
    }).populate([
      // {
      //   path: "user",
      // },
      "crafters.lyricist.assignedCrafterId",
      "crafters.singer.assignedCrafterId",
      "crafters.engineer.assignedCrafterId",
      { path: "plan" },
    ]);

    // Format the response with single submitted crafter
    const formattedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      let submittedCrafter = null;

      // Check each crafter role and get the first submitted one
      const roles = ["lyricist", "singer", "engineer"];

      for (const role of roles) {
        if (orderObj.crafters[role]?.submissionStatus === "submitted") {
          submittedCrafter = {
            role: role,
            ...orderObj.crafters[role],
          };
          break; // Take the first submitted crafter
        }
      }

      // Return the order with single submitted crafter
      return {
        _id: orderObj._id,
        name: orderObj.name,
        phone: orderObj.phone,
        email: orderObj.email,
        songGenre: orderObj.songGenre,
        jokes: orderObj.jokes,
        backgroundStory: orderObj.backgroundStory,
        plan: orderObj.plan,
        musicTemplate: orderObj.musicTemplate,
        currentStage: orderObj.currentStage,
        orderStatus: orderObj.orderStatus,
        finalSongUrl: orderObj.finalSongUrl,
        createdAt: orderObj.createdAt,
        updatedAt: orderObj.updatedAt,
        submittedCrafter: submittedCrafter, // Single object instead of nested roles
      };
    });

    return NextResponse.json({
      message: "Submitted crafters fetched successfully",
      data: formattedOrders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

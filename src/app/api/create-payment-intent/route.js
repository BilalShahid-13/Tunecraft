import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import User from "@/Schema/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Parse incoming request body
    const { amount, email, metadata } = await request.json();

    // Check if necessary fields exist in the metadata
    if (!metadata.packageName || !metadata.firstName) {
      throw new Error("Missing required metadata fields");
    }
    const lyricist = await User.findOne({
      role: "lyricist",
      approvalStatus: "approved",
    }).session(session);
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (not dollars)
      currency: "usd", // Use 'usd' or any other supported currency
      payment_method_types: ["card"],
      metadata, // Pass metadata to Stripe
      receipt_email: email, // Email for the receipt
    });

    if (!paymentIntent) {
      throw new Error("Payment Intent creation failed");
    }

    // Find or create a new plan for the order
    let plan = await Plan.findOne({ name: metadata.packageName }).session(
      session
    );
    if (!plan) {
      plan = new Plan({
        name: metadata.packageName,
        price: amount, // Store the price in cents
      });
      await plan.save({ session });
    }

    // Create a new order
    const orderSchema = new Order({
      name: `${metadata.firstName} ${metadata.lastName}`,
      phone: metadata.phone,
      email: email,
      plan: plan._id,
      songGenre: metadata.songGenre,
      musicTemplate: metadata.musicTitle,
      jokes: metadata.jokes,
      backgroundStory: metadata.backgroundStory,
      currentStage: "lyricist",
      crafters: {
        lyricist: {
          id: lyricist._id,
          submissionStatus: "available",
        },
      },
    });

    // Save the order in the session
    await orderSchema.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the client secret to the frontend
    return NextResponse.json({
      msg: "Order created successfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();

    console.error("Error in payment intent creation or order saving:", error);

    // Return the error response to the client
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

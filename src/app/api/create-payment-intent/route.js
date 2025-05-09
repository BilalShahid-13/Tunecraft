import { dbConnect } from "@/lib/dbConnect";
import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await dbConnect(); // <-- ensure DB is connected before anything else

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, email, metadata } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
      metadata,
      receipt_email: email,
    });

    if (!paymentIntent) {
      throw new Error("Payment Intent creation failed");
    }

    let plan = await Plan.findOne({ name: metadata.packageName });
    if (!plan) {
      plan = new Plan({
        name: metadata.packageName,
        price: amount,
      });
      await plan.save({ session });
    }

    const orderSchema = new Order({
      name: `${metadata.firstName} ${metadata.lastName}`,
      phone: metadata.phone,
      email: email,
      plan: plan._id,
      songGenre: metadata.songGenre,
      musicTemplate: metadata.musicTitle,
    });

    await orderSchema.save({ session });
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      msg: "Order created successfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error in payment intent creation or order saving:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

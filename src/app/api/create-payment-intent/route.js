import Order from "@/Schema/Order";
import Plan from "@/Schema/Plan";
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, email, metadata } = await request.json();

    // Create the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
      metadata,
      receipt_email: email,
    });

    // Check if paymentIntent was created successfully
    if (!paymentIntent) {
      throw new Error("Payment Intent creation failed");
    }

    // Check if the Plan already exists, if not, create it
    let plan = await Plan.findOne({ name: metadata.packageName });
    if (!plan) {
      plan = new Plan({
        name: metadata.packageName,
        price: amount,
      });

      // Save the plan to the database
      await plan.save({ session });
    }

    // Save the order to the database with the plan's _id
    const orderSchema = new Order({
      name: `${metadata.firstName} ${metadata.lastName}`,
      phone: metadata.phone,
      email: email,
      plan: plan._id, // Use the saved plan's _id
      songGenre: metadata.songGenre,
      musicTemplate: metadata.musicTitle,
    });

    // Save the order within the same transaction
    await orderSchema.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the client secret and success message
    return NextResponse.json({
      msg: "Order created successfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    console.error("Error in payment intent creation or order saving:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

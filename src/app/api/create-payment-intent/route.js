import Order from "@/Schema/Order";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export async function POST(request) {
  try {
    const { amount, email, metadata } = await request.json();

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
      metadata,
      receipt_email: email,
    });

    // Check if paymentIntent was created successfully
    if (paymentIntent) {
      // Log for debugging
      console.log("Payment Intent:", paymentIntent.client_secret);

      // Save order to database
      const orderSchema = new Order({
        name: `${metadata.firstName} ${metadata.lastName}`,
        phone: metadata.phone,
        email: email,
        plan: {
          name: metadata.packageName,
          price: amount,
        },
        songGenre: metadata.songGenre,
        musicTemplate: metadata.musicTitle,
      });

      const response = await orderSchema.save();
      if (response) {
        return NextResponse.json({
          msg: "Order created successfully",
          clientSecret: paymentIntent.client_secret, // <-- include this!
        });
      }

      // If the order is not saved, still return clientSecret for payment
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      }).status(201);
    }
  } catch (error) {
    console.error("Error in payment intent creation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

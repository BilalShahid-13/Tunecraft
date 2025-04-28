import Order from "@/Schema/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, email, metadata } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
      metadata,
      receipt_email: email,
    });
    if (paymentIntent) {
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
        return NextResponse.json({ msg: "Order created successfully" });
      }
    }
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    }).status(201);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

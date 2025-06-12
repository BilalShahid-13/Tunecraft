"use server";

import { convertToSubCurrency } from "@/lib/utils";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function stripePayout(amount) {
  try {
    const payout = await stripe.payouts.create({
      amount:convertToSubCurrency(amount),
      currency:"MXN",
    });
  } catch (error) {}
}

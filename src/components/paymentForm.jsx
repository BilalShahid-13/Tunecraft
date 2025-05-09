"use client"
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const stripeSecret = process.env.STRIPE_SECRET_KEY
const options = {
  clientSecret: stripeSecret,
};

export default function paymentForm() {
  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <PaymentElement />
      </Elements>
    </>
  )
}

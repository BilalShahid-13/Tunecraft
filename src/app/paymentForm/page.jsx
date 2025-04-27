"use client";

import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { convertToSubCurrency } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe.js has not yet loaded.");
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-success", // <-- your success URL
      },
    });

    if (error) {
      console.error("Payment confirmation error:", error.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

export default function Page() {
  const [clientSecret, setClientSecret] = useState("");
  const amount = 800
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/create-payment-intent',
          { amount: convertToSubCurrency(amount) },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        console.log(response.data);
        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
        }
      } catch (error) {
        console.error('Error creating PaymentIntent:', error);
      }
    }
    fetchData();
  }, []);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        '--color-primary': '#333',
        '--color-text': '#ffffff',
        '--color-border': '#333333',
        '--color-link': '#1e90ff',
      },
    },
  };


  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <div className='bg-black'>
            <CheckoutForm />
          </div>
        </Elements>
      )
      }
    </>
  );
}

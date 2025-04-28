"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useQuestionStore from "@/store/questionStore"
import { convertToSubCurrency } from "@/lib/utils"
import PhoneCode from "../Questions/_components/PhoneCode"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ packageName, packagePrice, processingFee, musicTitle, songGenre }) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const totalAmount = packagePrice + processingFee

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      // Create payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubCurrency(totalAmount), // Convert to cents
          email: formData.email,
          metadata: {
            packageName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            musicTitle: musicTitle,
            songGenre: songGenre
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong")
      }

      const { clientSecret } = await response.json()

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
            },
          },
        },
      })

      if (confirmError) {
        throw new Error(confirmError.message || "Payment failed")
      }

      if (paymentIntent.status === "succeeded") {
        if (sendMail(formData.email)) {
          router.push(`/success`);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMail = async (email) => {
    try {
      const response = await axios.post('/api/send-mail', {
        to: email,
        subject: 'Testing Email',
      })
      console.log(response)
      if (response) {
        toast.success('Payment Successful! 🎉', {
          description: `Thank you for your order! Please check your email at ${email} for further details.`,
          // style: { backgroundColor: '#7bf1a8', color: 'white' }, // Set background to red and text to white
        });
      }
      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <h1 className="text-3xl font-inter font-bold text-white">Payment Details</h1>
      <h2 className="text-lg text-white mb-4">Billing Information</h2>
      <div className="grid grid-cols-2 w-full gap-12 max-sm:grid-cols-1
       justify-center items-center mt-12">

        <div className="flex flex-col justify-start gap-8 w-full">
          <div className="grid grid-cols-2 justify-start gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter Name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <div className="flex flex-row justify-center items-center gap-2">
              <PhoneCode className={'w-[100px] px-2 py-0'} />
              <Input
                id="phone"
                name="phone"
                placeholder="123-000-00-00"
                required
                value={formData.phone}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>

          </div>
        </div>

        <div className="w-full grid grid-flow-row">
          <div className="space-y-2 -pt-21">
            <Label htmlFor="card" className="text-white">
              Card Number
            </Label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#fff",
                      "::placeholder": {
                        color: "#71717a",
                      },
                    },
                    invalid: {
                      color: "#ef4444", // text becomes red
                      "::placeholder": {
                        color: "#71717a", // placeholder stays gray
                      },
                    }
                  },
                }}
              />
            </div>
          </div>
          <div className="space-y-2 pt-7">
            <Label htmlFor="address" className="text-white">
              Billing Address
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="Street Address"
              required
              value={formData.address}
              onChange={handleChange}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>




      </div>
      <div className="space-y-2 border-t border-zinc-800 pt-4">
        <div className="flex justify-between text-zinc-400">
          <p>Package:&nbsp;
            <span className="uppercase">{packageName}</span>
          </p>
          <span>${packagePrice}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Processing Fee</span>
          <span>${processingFee}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-white">
          <span>Total:</span>
          <span className="text-[#ff6b6b]">${totalAmount}</span>
        </div>
      </div>
      {error && <div className="bg-red-900/30 text-red-400
         p-3 rounded-md text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white py-4"
      >
        {isLoading ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  )
}

export default function PaymentForm() {
  const { formData } = useQuestionStore();
  const [price, SetPrice] = useState({
    amount: 0,
    packageName: '',
    processingFee: 10,
    musicTitle: '',
    songGenre: ''
  });

  useEffect(() => {
    if (formData && formData.step3) {
      let priceString = formData.step3.planPrice; // Like "$2.299"
      let numericPrice = 0;
      let musicTitle = null;
      let songGenre = null;
      if (priceString) {
        numericPrice = Number(priceString.replace('MX$', ''));
        console.log('numericPrice', numericPrice);
      }
      if (formData.step4.musicTitle) {
        musicTitle = formData.step4.musicTitle
      } if (formData.step1.question) {
        songGenre = formData.step1.question
      }
      SetPrice({
        amount: numericPrice,
        packageName: formData.step3.placeName,
        processingFee: 10,
        musicTitle: musicTitle,
        songGenre: songGenre
      });
    }
  }, [formData]);

  return (
    <div className="justify-center items-center w-full flex">
      <div className="w-full p-4 rounded-lg bg-zinc-900">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            packageName={price.packageName}
            packagePrice={price.amount}
            processingFee={price.processingFee}
            musicTitle={price.musicTitle}
            songGenre={price.songGenre}
          />
        </Elements>
      </div>
    </div>
  );
}

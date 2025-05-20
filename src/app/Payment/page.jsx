"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { convertToSubCurrency } from "@/lib/utils"
import useQuestionStore from "@/store/questionStore"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PhoneCode from "../../components/PhoneCode"
import axios from "axios"
import { toast } from "sonner"
import { Currency } from "@/lib/Constant"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomInputField from "@/components/CustomInputField"
// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const checkOutSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().length(10, { message: "Phone number must be 10 digits" }),
  phoneCode: z.string().min(1, "Please select a country").max(3, "Invalid country code"),
  address: z.string().min(2, { message: "Address must be at least 2 characters" }),
})
function CheckoutForm({ packageName, packagePrice, processingFee, musicTitle, songGenre, personalInfo }) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [defaultCode, setDefaultCode] = useState('52');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const chekoutForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      phoneCode: "51",
      address: "",
    },
    resolver: zodResolver(checkOutSchema),
  })

  useEffect(() => {
    if (personalInfo) {
      chekoutForm.setValue("firstName", personalInfo.firstName)
      chekoutForm.setValue("lastName", personalInfo.lastName)
      chekoutForm.setValue("email", personalInfo.email)
      chekoutForm.setValue("phone", personalInfo.phone)
      setDefaultCode(personalInfo.phoneCode)
      // chekoutForm.setValue("phoneCode", personalInfo.phoneCode)
    }
  }, [personalInfo])

  console.log(personalInfo)

  const totalAmount = packagePrice + processingFee

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (data) => {
    console.log('handleSubmit', data, convertToSubCurrency(totalAmount),
      musicTitle, songGenre, packageName)

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubCurrency(totalAmount), // Convert to cents
          email: data.email,
          metadata: {
            packageName,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: `+(${data.phoneCode})` + data.phone,
            address: data.address,
            musicTitle: musicTitle,
            songGenre: songGenre,
            jokes: personalInfo.memories,
            backgroundStory: personalInfo.backgroundStory,
          },
        }),
      });

      console.log('Payment Intent Response:', response); // Add this log to check server response

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData); // Log the error response
        throw new Error(errorData.message || "Something went wrong");
      }

      const { clientSecret } = await response.json();

      console.log("Client Secret:", clientSecret); // Log the client secret

      // Confirm the payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: `+(${data.phoneCode})` + data.phone,
            address: {
              line1: data.address,
            },
          },
        },
      });

      if (confirmError) {
        console.error('Stripe Payment Error:', confirmError);
        throw new Error(confirmError.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        const res = await sendMail(data.email);
        if (res) {
          router.push(`/success`);
        }
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err); // Log the error to track issues
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  const sendMail = async (email) => {
    console.log('email', email)
    try {
      const response = await axios.post('/api/send-mail', {
        to: email
      })
      console.log(response)
      if (response) {
        toast.success('Payment Successful! 🎉', {
          description: `Thank you for your order! Please check your email at ${email} for further details.`,
          // style: { backgroundColor: '#7bf1a8', color: 'white' }, // Set background to red and text to white
        });
        return true
      }
    } catch (error) {
      console.error(error);
      return false
    }
  }

  return (
    <form onSubmit={chekoutForm.handleSubmit(handleSubmit)} className="w-full space-y-2 px-4">
      <h1 className="text-3xl font-inter font-bold text-white">Payment Details</h1>
      <h2 className="text-lg text-white mb-4">Billing Information</h2>
      <div className="grid grid-cols-2 w-full gap-12 max-sm:grid-cols-1
       justify-center items-center mt-12">

        <div className="flex flex-col justify-start gap-8 w-full">
          <div className="grid grid-cols-2 justify-start gap-3">
            <CustomInputField
              errors={chekoutForm.formState.errors}
              type="firstName"
              label="First Name"
              {...chekoutForm.register('firstName')}
              // value={formData.firstName}
              placeholder="Enter Name" />
            <CustomInputField
              errors={chekoutForm.formState.errors}
              type="lastName"
              label="Last Name"
              {...chekoutForm.register('lastName')}
              // value={formData.firstName}
              placeholder="Enter Name" />
          </div>
          <div className="space-y-2">
            <CustomInputField
              errors={chekoutForm.formState.errors}
              type="email"
              label="Email"
              {...chekoutForm.register('email')}
              // value={formData.firstName}
              placeholder="Enter Email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <div className="flex flex-row justify-center items-center gap-2">
              <PhoneCode className={'w-[100px] px-2 py-0'}
                // {...CheckoutForm.register('phoneCode')}
                signupForm={chekoutForm} defaultValue={defaultCode} />
              <CustomInputField
                className={'py-0'}
                {...chekoutForm.register('phone')}
                type="phone"
                label={null}
                placeholder="123-000-00-00" />
            </div>
            {chekoutForm.formState.errors.phone &&
              <span className="input-error">
                {chekoutForm.formState.errors.phone.message}</span>}
            {chekoutForm.formState.errors.phoneCode &&
              <span className="input-error">
                {chekoutForm.formState.errors.phoneCode.message}</span>}
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
            <CustomInputField
              errors={chekoutForm.formState.errors}
              type="address"
              label={'Billing Address'}
              {...chekoutForm.register('address')}
              // value={CheckoutForm.}
              placeholder="Street Address" />
          </div>
        </div>

      </div>
      <div className="space-y-2 border-t border-zinc-800 pt-4">
        <div className="flex justify-between text-zinc-400">
          <p>Package:&nbsp;
            <span className="uppercase">{packageName}</span>
          </p>
          <span>{Currency}{packagePrice}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Processing Fee</span>
          <span>{Currency}{processingFee}</span>
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
        className="w-full bg-[#ff6b6b] hover:bg-[#ff5252]
         text-white py-4 cursor-pointer"
      >
        {isLoading ? <React.Fragment>
          <Loader2 className="animate-spin" /> Processing
        </React.Fragment> : "Complete Payment"}
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
  console.log('formData', formData)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCode: "",
    memories: "",
    backgroundStory: ""
  })

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
    if (formData && formData.step2) {
      const username = formData.step2.name || "";
      const [firstName, lastName] = username.split(' ');
      if (username) {
        setPersonalInfo({
          firstName: firstName || "",
          lastName: lastName || "",
          email: formData.step2?.email,
          phone: formData.step2?.phone,
          phoneCode: formData.step2?.phoneCode,
          memories: formData.step2?.memories,
          backgroundStory: formData.step2?.backgroundStory
        })
      }
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
            personalInfo={personalInfo}
          />
        </Elements>
      </div>
    </div>
  );
}

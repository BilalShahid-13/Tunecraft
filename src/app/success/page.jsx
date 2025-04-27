"use client";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from 'react';
import { toast } from "sonner";

export default function Page() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'bilalshahid03367312034@gmail.com'; // Default email fallback

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/send-mail', {
          to: email,
          subject: 'Testing Email',
        });
        if (response) {
          toast.success('Payment Successful! 🎉', {
            description: `Thank you for your order! Please check your email at ${email} for further details.`,
          });

          // Navigate to home page after 3 seconds to give users time to see the success message
          // setTimeout(() => navigate.push('/'), 3000);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong! Please try again later.');
      }
    };

    fetchData();
  }, [email, navigate]);

  return (
    <div className="flex justify-center items-center">
      <Card className="relative w-[350px] px-2 overflow-hidden">
        <CardHeader>
          <CardTitle>Thank You for Your Order! 🎶</CardTitle>
          <CardDescription>
            Your payment has been received successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="text-zinc-400 font-inter text-sm flex flex-col gap-3">
            <li> ✨ We've sent a confirmation email to your inbox.</li>
            <li> ✨ Our team of talented artists and lyricists has started working on your personalized song based on your story.</li>
            <li> ✨ You will receive updates as we progress.</li>
            <li> 📅 Estimated Delivery Time: 3-5 working days </li>
          </ol>
        </CardContent>
        <CardFooter>
          <ol className="text-zinc-400 font-inter text-sm flex flex-col gap-3">
            <li>  Need any changes or have special requests?</li>
            <li>  Feel free to &nbsp;
              <a href="mailto:bilalshahid03367312034@gmail.com"
                className="underline text-red-400">Contact Us</a>&nbsp; anytime! </li>
            <li>  Thank you for trusting us to create something unforgettable! ❤️</li>
          </ol>
        </CardFooter>
        <BorderBeam duration={8} size={100} />
        <Button onClick={() => navigate.push('/')} className={'bg-red-400 text-white hover:bg-red-500 cursor-pointer'}>Explore More</Button>
      </Card>
    </div>
  );
}

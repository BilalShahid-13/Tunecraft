"use client";
import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import useResetStore from "@/store/resetStore";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "Only digits allowed" }),
});

export default function OtpTab({ onNext }) {
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onChange",
  });
  const { addOtp, otp: storedOtp, email } = useResetStore();

  // Pre-fill and validate if OTP was stored
  useEffect(() => {
    if (storedOtp) {
      form.setValue("otp", storedOtp);
      form.trigger("otp");
    }
  }, [storedOtp, form]);

  const onSubmit = async (data) => {
    console.log("OTP entered:", data.otp);
    if (!email) {
      form.setError("otp", {
        type: "manual",
        message: "Please complete the Email step first.",
      });
      return;
    }
    addOtp(data.otp);
    try {
      const res = await axios.post('/api/verify-otp', {
        email,
        otp: data.otp
      })
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => onNext(), 500);
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to send reset link';
      toast.error(msg);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  className="flex justify-center items-center space-x-2"
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-10 text-2xl text-center border rounded"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-10 text-2xl text-center border rounded"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            className={'primary-btn'}
            disabled={!form.formState.isValid}
          >
            {form.formState.isSubmitting ?
              <React.Fragment>
                <Loader2 className="animate-spin" />
                Verifying...
              </React.Fragment> : "Verify"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import useResetStore from '@/store/resetStore';
import axios from 'axios';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function EmailTab({ onNext }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const addEmail = useResetStore((state) => state.addEmail);
  const storedEmail = useResetStore((state) => state.email);

  useEffect(() => {
    if (storedEmail) {
      setValue('email', storedEmail);
    }
  }, [storedEmail, setValue]);

  const onSubmit = async (data) => {
    addEmail(data.email);

    try {
      const res = await axios.post('/api/forgot-password', {
        email: data.email,
      });
      console.log(res)
      toast.success(res.data.message);
      setTimeout(() => onNext(), 500);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to send reset link';
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4 p-3 rounded-md justify-center items-center"
    >
      <div className="space-y-3 w-full">
        <Label htmlFor="email" className="text-white">
          Email Address
        </Label>
        <div className="inputfield-box">
          <Mail />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="w-full">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
        >
          {isSubmitting ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </div>
    </form>
  );
}

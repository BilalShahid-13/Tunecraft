"use client";
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useResetStore from '@/store/resetStore';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PasswordTab() {
  // now includes confirmPassword and a refinement to ensure they match:
  const passwordSchema = z
    .object({
      password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
      confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: "Passwords don't match",
    });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { email, otp, addPassword, addOtp, addEmail } = useResetStore();
  const navigate = useRouter()
  const onSubmit = async ({ password: newPassword }) => {
    if (!email || !otp) {
      setError('password', {
        type: 'manual',
        message: 'Please complete the Email and OTP steps first.',
      });
      return;
    }

    try {
      const res = await axios.post('/api/reset-password', {
        email,
        token: otp,
        newPassword,
      });

      toast.success(res.data.message);
      // clear stored values
      addPassword(null);
      addOtp(null);
      addEmail(null);
      navigate.push('/Register')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to reset password';
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4 p-3 rounded-md justify-center items-center"
    >
      {/* New Password */}
      <div className="space-y-3 w-full">
        <Label htmlFor="password" className="text-white">
          New Password
        </Label>
        <div className="inputfield-box">
          <Lock />
          <Input
            id="password"
            type="password"
            placeholder="password"
            className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="input-error">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-3 w-full">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirm Password
        </Label>
        <div className="inputfield-box">
          <Lock />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="input-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="w-full">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Resetting
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </div>
    </form>
  );
}

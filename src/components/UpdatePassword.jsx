"use client";

import { Lock, Mail } from 'lucide-react';
import CustomInputField from './CustomInputField';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';  // <-- added
import { toast } from 'sonner';

// Schemas
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
});

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    // .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
    // .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
    // .regex(/[0-9]/, { message: "Must contain a number" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default function UpdatePassword() {
  const { data: session } = useSession();

  // Personal‐info form
  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    setValue,
    formState: { errors: personalInfoErrors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  // Populate initial values
  useEffect(() => {
    if (session?.user) {
      // const username = session.user.username.split("");
      // console.log(username)
      setValue("firstName", session.user.username || "");
      setValue("lastName", session.user.name || "");
      setValue("email", session.user.email || "");
    }
  }, [session, setValue]);

  // 1) Personal info submit
  const onSubmitPersonalInfo = async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
      };
      const res = await axios.patch('/api/update-user', payload);
      console.log('Personal info updated:', res.data);
      if (res.data?.message) {
        toast.success(res.data.message);
      } else {
        toast.success('Name updated successfully');
      }
      // e.g. toast.success('Name updated')
    } catch (err) {
      console.error('Error updating personal info:', err.response?.data || err.message);
      // e.g. toast.error(err.response?.data?.error || 'Update failed')
    }
  };

  // 2) Password submit
  const onSubmitPassword = async (data) => {
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const res = await axios.patch('/api/update-user', payload);
      console.log('Password updated:', res.data);
      if (res.data?.message) {
        toast.success('Password updated successfully');
      } else {
        toast.success('Name updated successfully');
      }
      reset();
      // e.g. toast.success('Password changed')
    } catch (err) {
      console.error('Error updating password:', err.response?.data || err.message);
      // e.g. toast.error(err.response?.data?.error || 'Password change failed')
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}
        className="w-[70%] flex flex-col gap-4 ml-4 bg-zinc-950 p-3 rounded-lg mt-3"
        noValidate
      >
        <h2 className="text-3xl font-normal font-inter">Account Setting</h2>
        <h2 className="text-lg font-semibold font-inter capitalize">personal information</h2>

        <div className="flex gap-5 w-full">
          <div className="w-full space-y-2">
            <Label htmlFor="firstName" className="text-white">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              {...registerPersonalInfo("firstName")}
            />
            {personalInfoErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {personalInfoErrors.firstName.message}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="lastName" className="text-white">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              {...registerPersonalInfo("lastName")}
            />
            {personalInfoErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {personalInfoErrors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="relative w-full space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Mail className="absolute left-3 top-8 h-5 w-5 text-zinc-500" />
          <Input
            id="email"
            disabled
            type="email"
            placeholder="Enter your email"
            className="pl-10 w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            {...registerPersonalInfo("email")}
          />
          {personalInfoErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {personalInfoErrors.email.message}
            </p>
          )}
        </div>

        <Button className="bg-[#ff7e6e] hover:bg-red-400" type="submit">
          Save Changes
        </Button>
      </form>

      <form
        onSubmit={handleSubmitPassword(onSubmitPassword)}
        className="w-[70%] flex flex-col gap-4 ml-4 bg-zinc-950 p-3 rounded-lg mt-3"
        noValidate
      >
        <div className="relative w-full">
          <Lock className="absolute left-3 top-2 h-5 w-5 text-zinc-500" />
          <Input
            type="password"
            placeholder="Current password"
            className="pl-10 w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            {...registerPassword("currentPassword")}
          />
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="relative w-full">
          <Lock className="absolute left-3 top-2 h-5 w-5 text-zinc-500" />
          <Input
            type="password"
            placeholder="New password"
            className="pl-10 w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            {...registerPassword("newPassword")}
          />
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.newPassword.message}
            </p>
          )}
        </div>

        <div className="relative w-full">
          <Lock className="absolute left-3 top-2 h-5 w-5 text-zinc-500" />
          <Input
            type="password"
            placeholder="Confirm new password"
            className="pl-10 w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            {...registerPassword("confirmNewPassword")}
          />
          {passwordErrors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <Button className="bg-[#ff7e6e] hover:bg-red-400" type="submit">
          Update Password
        </Button>
      </form>
    </>
  );
}

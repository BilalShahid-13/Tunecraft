"use client";
import CustomInputField from "@/components/CustomInputField";
import PhoneCode from "@/components/PhoneCode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(20, { message: "Username must be at most 20 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().length(10, { message: "Phone number must be 10 digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  phoneCode: z.string().min(1, "Please select a country").max(3, "Invalid country code"),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
export default function UpdateUser({ user }) {
  const [defaultPhoneCode, setDefaultPhoneCode] = useState(null);
  const [users, setUsers] = useState(null)
  const updateForm = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone: "",
      password: "",
      confirmPassword: "",
      phoneCode: "",
    },
  });

  useEffect(() => {
    const match = user?.phone.match(/\(\+(\d+)\)(\d+)/);
    const code = match?.[1];
    const number = match?.[2];
    setDefaultPhoneCode(code);
    setUsers(user)
    updateForm.reset({
      username: user?.username || "",
      email: user?.email || "",
      phone: number || "",
      password: "",
      confirmPassword: "",
      phoneCode: code || "",
    });
  }, [user]);

  useEffect(() => {
    console.log(users)
    const match = user?.phone.match(/\(\+(\d+)\)(\d+)/);
    const code = match?.[1];
    const number = match?.[2];
    console.log(match)
  }, [users])

  const onReset = () => {
    const match = user?.phone.match(/\(\+(\d+)\)(\d+)/);
    const code = match?.[1];
    const number = match?.[2];
    setDefaultPhoneCode(code);

    updateForm.reset({
      username: user?.username || "",
      email: user?.email || "",
      phone: number || "",
      password: "",
      confirmPassword: "",
      phoneCode: code || "",
    });
  };

  const onSubmit = async (data) => {
    console.log(data)

    try {
      const res = await axios.patch('/api/update-users-all', {
        id: user._id,
        username: data.username,
        email: data.email,
        phone: `(+${data.phoneCode})${data.phone}`,
        password: data.password
      })
      if (res.statusText === "OK") {
        toast.success(res.data.message)
        console.log(res)
      }
    } catch (error) {
      toast.success(error.response.data.error)
      console.error(error);

    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          onSubmit={updateForm.handleSubmit(onSubmit)}
        >
          <CustomInputField
            label="username"
            placeholder="update username"
            errors={updateForm.formState.errors}
            {...updateForm.register("username")}
            type="text"
          />
          <CustomInputField
            label="email"
            placeholder="update email"
            errors={updateForm.formState.errors}
            {...updateForm.register("email")}
            type="email"
          />
          <div className="flex flex-row justify-center items-center gap-1">
            <PhoneCode signupForm={updateForm} defaultValue={defaultPhoneCode} />
            <Input {...updateForm.register("phone")} className="py-5" />
          </div>
          <CustomInputField
            label="password"
            placeholder="password"
            errors={updateForm.formState.errors}
            {...updateForm.register("password")}
            type="password"
          />
          <CustomInputField
            label="confirm password"
            placeholder="confirm password"
            errors={updateForm.formState.errors}
            {...updateForm.register("confirmPassword")}
            type="password"
          />

          <DialogFooter className="flex gap-2 justify-end">
            <Button type="button" variant="destructive" onClick={onReset}>
              Reset
            </Button>
            <Button type="submit" disabled={!updateForm.formState.isValid}>
              {updateForm.formState.isSubmitting ?
                <React.Fragment>
                  <Loader2 className="animate-spin" />
                  Updating...
                </React.Fragment> : 'Update Changes'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}

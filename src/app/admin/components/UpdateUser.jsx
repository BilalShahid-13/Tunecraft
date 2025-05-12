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
import useAllUsers from "@/store/allUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .length(10, { message: "Phone number must be 10 digits" }),

  password: z
    .string()
    // .min(8, { message: "Password must be at least 8 characters" })
    .optional(),

  confirmPassword: z
    .string()
    .optional(),

  phoneCode: z
    .string()
    .min(1, "Please select a country")
    .max(3, "Invalid country code"),
})
  .refine((data) => {
    // If password is provided, confirmPassword must match password
    if (data.password && data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "fullName must be at least 2 characters" })
    .max(50, { message: "fullName must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
});


export default function UpdateUser({ user }) {
  const [defaultPhoneCode, setDefaultPhoneCode] = useState(null);
  const [users, setUsers] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const { setIsUpdate } = useAllUsers()
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

  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    setValue,
    setError,
    getValues,
    formState: { errors: personalInfoErrors, isValidating, isSubmitting },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: user?.username,
      email: user?.email
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

    const payload = {};

    // Check if phone has changed, if so, update the phone in the payload
    const match = users.phone.match(/\(\+(\d+)\)(\d+)/);
    const code = match?.[1];
    const number = match?.[2];
    console.log(data.phoneCode, defaultPhoneCode, code);

    if (data.username !== users.username) {
      console.log("Updating username:", data.username);
      payload.username = data.username;
    }

    if (data.email !== users.email) {
      console.log("Updating email:", data.email);
      payload.email = data.email;
    }

    if (data.phone !== number && data.phoneCode !== code) {
      console.log("Updating phone:", data.phone);
      payload.phone = `(+${data.phoneCode})${data.phone}`;
    }

    // Handle password update if password is changed
    if (data.password && data.password !== users.password) {
      console.log("Updating password");
      payload.password = data.password;
    }

    // Ensure you are passing the user ID in the payload
    payload.id = users._id;
    console.log(payload)
    try {
      const res = await axios.patch('/api/update-users-all', payload);
      if (res.statusText === 'OK') {
        toast.success(res.data.message);
        setIsOpen(false)
        setIsUpdate(true);
        console.log(res.data);
      } else {
        toast.error("Error updating user");
        console.error(error);
        
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
      console.error(error.response?.data?.error || error.message);
    }
  };

  const toggleDialogBox = () => {
    setIsOpen(!isOpen);
  }


  return (
    <Dialog open={isOpen} onOpenChange={toggleDialogBox}>
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
          {updateForm.formState.errors.phone &&
            <p className="text-red-500 text-xs">{updateForm.formState.errors.phone.message}</p>}
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
            <Button type="submit"
            // disabled={!updateForm.formState.isValid}
            >
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

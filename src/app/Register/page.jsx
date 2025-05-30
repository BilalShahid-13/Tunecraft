"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { getSession, signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import SignIn from "./components/Signin"
import Signup from "./components/Signup"
import axios from "axios"
// Define form schemas with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
})

const signupSchema = z.object({
  role: z.enum(["lyricist", "singer", "engineer"], {
    required_error: "Please select a role",
  }),
  select: z.string().optional().nullable(),
  file: z.array(z.instanceof(File)).min(1, "At least one file required"),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().length(10, { message: "Phone number must be 10 digits" }),
  phoneCode: z.string().min(1, "Please select a country").max(3, "Invalid country code"),
  textField: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((data.role === "lyricist" || data.role === "singer") && (!data.select || data.select.trim() === "")) {
    ctx.addIssue({
      path: ["select"],
      code: z.ZodIssueCode.custom,
      message: "Please select a valid option",
    });
  }
});

export default function page() {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState(null);
  const [onFileReset, setOnFileReset] = useState(false);
  const { data: session } = useSession();
  const navigate = useRouter();

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Signup form
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: undefined,
      fullName: "",
      email: "",
      select: '',
      password: "",
      file: [],
      phoneCode: "52",
      phone: "",
    },
  })

  const onLoginSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res.ok) {
        const session = await getSession(); // Fetch updated session

        if (session?.user?.role) {
          toast.success("Login successful!");
          loginForm.reset();
          navigate.push(`/${session.user.role.toLowerCase()}`);
        } else {
          toast.error("Role information missing in session.");
        }
      } else {
        toast.error(res.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login exception:", error);
      toast.error("Something went wrong during login");
    }
  };

  // const formData = new FormData();
  const onhandleSignup = async (data) => {
    const formData = new FormData();
    console.log('file', data.file)
    formData.append("username", data.fullName);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("phone", `(+${data.phoneCode})` + data.phone);
    formData.append("details", data.textField);
    formData.append("musicTemplate", data.select || "");
    if (data.file) {
      formData.append("cv", data.file[0]);
    }
    try {
      const res = await axios.post('/api/create-user', formData);
      if (res.data.success) {
        setOnFileReset(true)
        signupForm.reset();
        console.log('signupForm File', signupForm.getValues('file'))
        toast.success(res.data.msg)
        navigate.push('/')
      } else {
        toast.error(res.data.msg || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data.msg || error.message);
      console.error(error.response?.data.msg || error.message);
    }


  };
  const watchRole = signupForm.watch("role")
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const selectRole = (role) => {
    setSelectedRole(role)
    signupForm.setValue("role", role)
  }


  return (
    <div className="w-full max-w-lg max-sm:w-[90%]
    mx-auto overflow-x-hidden flex justify-center items-center">
      <Tabs defaultValue="login" value={activeTab}
        onValueChange={handleTabChange}
        className="w-full font-inter">
        <TabsList className="flex flex-row mb-6 font-inter
        justify-center items-center w-full gap-2 py-5" >
          <TabsTrigger
            value="login"
            className={`font-inter ${activeTab === "login" ? "bg-[#ff6b6b] text-white"
              : "bg-zinc-900 text-white"} py-4 font-inter font-normal`}
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className={`font-inter ${activeTab === "signup" ? "bg-[#ff6b6b] text-white"
              : "bg-zinc-900 text-white"} py-4 font-inter font-normal`}
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login" className="bg-[#111111] p-6 rounded-lg">
          <SignIn onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            loginForm={loginForm}
            navigate={navigate} />
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup" className="bg-[#111111] p-6 rounded-lg">
          <Signup
            onSubmit={signupForm.handleSubmit(onhandleSignup)}
            selectRole={selectRole}
            selectedRole={selectedRole}
            watchRole={watchRole}
            onReset={onFileReset}
            signupForm={signupForm} />
        </TabsContent>
      </Tabs>
    </div >
  )
}

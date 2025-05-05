"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import SignIn from "./components/Signin"
import Signup from "./components/Signup"
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
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})



export default function page() {
  const [activeTab, setActiveTab] = useState("login")
  const [selectedRole, setSelectedRole] = useState(null)
  const { data: session } = useSession()
  const navigate = useRouter()
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
      password: "",
    },
  })

  const onLoginSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res) {
        toast.success('Login successful!')
        if (session?.user?.role) {
          navigate.push(`/${session.user.role.toLowerCase()}`)
        } else {
          navigate.refresh()
        }
        loginForm.reset()
      }
    } catch (error) {
      console.error('Error during login:', error)
      toast.error('Error during login')
    }
  }

  const onhandleSignup = async (data) => {
    console.log(data); // Log the data to see what’s coming in
    try {
      // Call the NextAuth signIn function
      const res = await signIn("credentials", {
        username: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        redirect: false,  // Prevents automatic redirect after sign-in
      });


      console.log(res); // Log the response to inspect the result
      if (res) {
        toast.success('Signup successful!');
        if (session?.user?.role) {
          navigate.push(`/${session.user.role.toLowerCase()}`)
          // If there's an error (e.g., invalid credentials), handle it
        } else {
          navigate.refresh()
        }
        signupForm.reset();
      }

    } catch (error) {
      console.error(error);
      toast.error('Error during verification');
    }
  };


  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const selectRole = (role) => {
    setSelectedRole(role)
    signupForm.setValue("role", role)
  }


  return (
    <div className="w-full max-w-lg max-sm:w-[90%] mx-auto h-[80vh] overflow-hidden flex justify-center items-center">
      <Tabs defaultValue="login" value={activeTab}
        onValueChange={handleTabChange}
        className="w-full ">
        <TabsList className="flex flex-row mb-6
        justify-center items-center w-full gap-2 py-5" >
          <TabsTrigger
            value="login"
            className={`${activeTab === "login" ? "bg-[#ff6b6b] text-white"
              : "bg-zinc-900 text-white"} py-4 font-inter font-normal`}
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className={`${activeTab === "signup" ? "bg-[#ff6b6b] text-white"
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
            signupForm={signupForm} />
        </TabsContent>
      </Tabs>
    </div >
  )
}

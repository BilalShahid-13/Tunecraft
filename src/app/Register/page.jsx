"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const onLoginSubmit = (data) => {
    console.log("Login data:", data)
    // Handle login logic here
  }

  const onSignupSubmit = (data) => {
    console.log("Signup data:", data)
    // Handle signup logic here
  }

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
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative justify-start items-start flex">
                <Mail className="absolute left-3 top-2 h-5 w-5 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
                  {...loginForm.register("email")}
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 h-5 w-5 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
                  {...loginForm.register("password")}
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...loginForm.register("rememberMe")}
                  className="border-zinc-700 data-[state=checked]:bg-[#ff6b6b] data-[state=checked]:border-[#ff6b6b]"
                />
                <Label htmlFor="rememberMe" className="text-white">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="text-[#ff6b6b] p-0">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup" className="bg-[#111111] p-6 rounded-lg">
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">I am a</Label>
              <div className="grid grid-cols-3 gap-2">
                {["lyricist", "singer", "engineer"].map((role) => (
                  <Button
                    key={role}
                    type="button"
                    className={cn(
                      "bg-zinc-800 hover:bg-zinc-700 text-white capitalize",
                      selectedRole === role && "bg-zinc-700",
                    )}
                    onClick={() => selectRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
              {signupForm.formState.errors.role && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
                  {...signupForm.register("fullName")}
                />
              </div>
              {signupForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signupEmail" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
                  {...signupForm.register("email")}
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signupPassword" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-zinc-800 border-zinc-700 pl-10 text-white placeholder:text-zinc-500"
                  {...signupForm.register("password")}
                />
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
              disabled={signupForm.formState.isSubmitting}
            >
              {signupForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div >
  )
}

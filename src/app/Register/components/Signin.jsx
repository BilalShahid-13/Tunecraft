'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignIn({ onSubmit, loginForm, isLoading }) {
  const navigate = useRouter();
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <div className="inputfield-box">
            <Mail />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...loginForm.register("email")}
            />
          </div>

          {loginForm.formState.errors.email && (
            <p className="input-error">{loginForm.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <div className="relative inputfield-box">
            <Lock />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="inputfield"
              {...loginForm.register("password")}
            />
          </div>
          {loginForm.formState.errors.password && (
            <p className="input-error">{loginForm.formState.errors.password.message}</p>
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
          <Button variant="link" className="text-[#ff6b6b] p-0 cursor-pointer"
            onClick={() => navigate.push("/reset-password")}>
            Forgot password?
          </Button>
        </div>

        <Button
          type="submit"
          className="primary-btn"
          disabled={isLoading}
        >
          {isLoading ? <>
            <Loader2 className="animate-spin" />
            Logging in
          </> : "Log In"}
        </Button>
      </form>
    </>
  )
}
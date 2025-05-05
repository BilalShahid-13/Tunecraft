import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LoaderCircle, Lock, Mail, User } from 'lucide-react'
import React from 'react'

export default function Signup({ onSubmit, signupForm, selectRole, selectedRole }) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
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
            <p className="input-error">{signupForm.formState.errors.role.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">
            Full Name
          </Label>
          <div className="relative inputfield-box">
            <User />
            <Input
              id="fullName"
              placeholder="Enter your full name"
              className="inputfield"
              {...signupForm.register("fullName")}
            />
          </div>
          {signupForm.formState.errors.fullName && (
            <p className="input-error">{signupForm.formState.errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupEmail" className="text-white">
            Email Address
          </Label>
          <div className="inputfield-box">
            <Mail />
            <Input
              id="signupEmail"
              type="email"
              placeholder="Enter your email"
              className="inputfield"
              {...signupForm.register("email")}
            />
          </div>
          {signupForm.formState.errors.email && (
            <p className="input-error">{signupForm.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupPassword" className="text-white">
            Password
          </Label>
          <div className="inputfield-box">
            <Lock />
            <Input
              id="signupPassword"
              type="password"
              placeholder="Enter your password"
              className="inputfield"
              {...signupForm.register("password")}
            />
          </div>
          {signupForm.formState.errors.password && (
            <p className="input-error">{signupForm.formState.errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="primary-btn"
          disabled={signupForm.formState.isSubmitting}
        >
          {signupForm.formState.isSubmitting ? <>
            <p>Creating Account</p> <LoaderCircle className="animate-spin" />
          </> : "Create Account"}
        </Button>
      </form>
    </>
  )
}

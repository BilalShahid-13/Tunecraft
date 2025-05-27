import CustomFileInput from '@/components/CustomFileInput'
import CustomInputField from '@/components/CustomInputField'
import PhoneCode from '@/components/PhoneCode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { QuestionsItem } from '@/lib/Constant'
import { cn } from '@/lib/utils'
import { LoaderCircle, Mail, User } from 'lucide-react'
import { useState } from 'react';
import { Controller } from 'react-hook-form'

export default function Signup({
  onSubmit,
  signupForm,
  selectRole,
  selectedRole,
  watchRole
}) {
  const [role, setRole] = useState(null);

  function get(role) {
    selectRole(role);
    setRole(role);
  }

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
                  selectedRole === role && "bg-zinc-700"
                )}
                onClick={() => {
                  get(role);
                }}
              >
                {role}
              </Button>
            ))}
          </div>
          {signupForm.formState.errors.role && (
            <p className="input-error">{signupForm.formState.errors.role.message}</p>
          )}
        </div>

        {["lyricist", "singer"].includes(watchRole) && (
          <Controller
            control={signupForm.control}
            name="select"
            rules={{ required: "This field is required" }}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label className="text-white" htmlFor="select">
                  {watchRole === "lyricist"
                    ? "Select a question for the writer"
                    : "Select a question for the singer"}
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {QuestionsItem.map((item, index) => (
                      <SelectItem key={index} value={item.question}>
                        {item.question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        )}


        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
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
          <Label htmlFor="signupEmail" className="text-white">Email Address</Label>
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

        {/* phone */}
        <div className='flex flex-col gap-1'>
          <div className='flex flex-row justify-center items-center gap-1'>
            <PhoneCode signupForm={signupForm} />
            <CustomInputField
              label={''}
              placeholder='Enter your WhatsApp number'
              errors={null}
              type={'phone'}
              {...signupForm.register("phone")}
            />
          </div>
          {signupForm.formState.errors.phone && (
            <p className="input-error">{signupForm.formState.errors.phone.message}</p>
          )}
        </div>

        {/* textarea */}
        <div className="space-y-2">
          <Label htmlFor="details" className="text-white"> Additional information or preferences</Label>
          <Textarea placeholder="Write anything you'd like us to know..."
            id='details'
            {...signupForm.register("textField")} />

        </div>
        {signupForm.formState.errors.textField && (
          <p className="input-error">{signupForm.formState.errors.textField.message}</p>
        )}
        <CustomFileInput
          signupForm={signupForm}
          fieldName="file"  // Since your schema uses 'file' not 'files'
          acceptedTypes={['application/pdf']}  // Add accepted types
        />
        {signupForm.formState.errors.file && (
          <p className="text-red-500">{signupForm.formState.errors.file.message}</p>
        )}


        <Button
          type="submit"
          className="primary-btn"
          disabled={signupForm.formState.isSubmitting}
        >
          {signupForm.formState.isSubmitting ? (
            <>
              <p>Creating Account</p> <LoaderCircle className="animate-spin" />
            </>
          ) : "Create Account"}
        </Button>
      </form>
    </>
  );
}

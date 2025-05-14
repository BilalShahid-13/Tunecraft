"use client";
import CustomInputField from '@/components/CustomInputField';
import PhoneCode from '@/components/PhoneCode';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import useQuestionStore from '@/store/questionStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const SelectItems = [
  "Parent", "Sibling", "Spouse", "Friend",
  "Partner", "Others"
];

const schema = z
  .object({
    name: z.string().nonempty("Recipient's Name is required"),
    email: z.string().optional(),
    message: z.string().optional(),
    contactMethod: z.enum(["whatsapp", "email"]),
    phone: z.string().optional(),
    phoneCode: z.string().min(1, "Please select a country").max(3, "Invalid country code"),
    relationship: z.enum(SelectItems, {
      required_error: "Please select a relationship",
    }),
    memories: z.string().optional(),
    backgroundStory: z.string().min(10, { message: "Background story required" }),
    relationshipValue: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Relationship validation
    if (data.relationship === "Others" && !data.relationshipValue?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify your relationship",
        path: ["relationshipValue"],
      });
    }

    // Contact method validation
    if (data.contactMethod === "whatsapp") {
      if (!data.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "WhatsApp number is required",
          path: ["phone"],
        });
      } else if (!/^\d{10,15}$/.test(data.phone)) { // More flexible phone number validation
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid WhatsApp number (10-15 digits)",
          path: ["phone"],
        });
      }

      // Ensure that email is not provided when contact method is 'whatsapp'
      if (data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email should not be provided when WhatsApp is selected",
          path: ["email"],
        });
      }
    }

    if (data.contactMethod === "email") {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["email"],
        });
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email address",
          path: ["email"],
        });
      }

      // Ensure that phone is not provided when contact method is 'email'
      if (data.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number should not be provided when email is selected",
          path: ["phone"],
        });
      }
    }
  });

const CustomTextArea = ({
  errors, type, label = 'First Name',
  placeholder = 'email', value, className, ...props
}) => {
  return (
    <div className='flex flex-col gap-3 w-full'>
      {label && <Label htmlFor={label}
        className={'font-normal'}>{label}</Label>}
      <Textarea id={label} {...props} type={type} value={value}
        className={cn(`h-24 w-full max-sm:text-sm`, className)}
        placeholder={placeholder} />
      {errors && errors[type] &&
        <p className='input-error'>{errors[type]?.message}</p>}
    </div>
  );
};

export default function Step2({ onNext, onPrev }) {
  const signup = useForm({
    resolver: zodResolver(schema),
    defaultValues: { contactMethod: "whatsapp" }
  });
  const [currentTab, setCurrentTab] = useState(1);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [userData, setUserData] = useState({});
  const { onSubmitted, formData } = useQuestionStore();
  const contactMethod = signup.watch("contactMethod");
  const [tabDefaultValue, setTabDefaultValue] = useState('whatsapp')
  const relationship = signup.watch("relationship");
  useEffect(() => {
    if (formData.step2) {
      setUserData(formData.step1);
      Object?.entries(formData.step2).forEach(([key, value]) => {
        signup.setValue(key, value);
        // signup.setVa;
      });
      setTabDefaultValue(formData.step2.contactMethod === 'whatsapp' ? 'whatsapp' : 'email')
      // setCurrentTab(formData.step2.contactMethod === 'whatsapp' ? 1 : 2)
      if (formData.step2.contactMethod === 'whatsapp') {
        setCurrentTab(1)
      } else if (formData.step2.contactMethod === 'email') {
        setCurrentTab(2)
      }
      if (formData.step2.relationship) {
        signup.setValue("relationship", formData.step2.relationship || "Parent");
        signup.setValue("relationshipValue", formData.step2.relationshipValue || "");
        setSelectedRelationship(formData.step2.relationship || "Parent");
        console.log("formData.step2", formData.step2.relationship);
      }
    }
  }, [formData]);

  const onSubmit = (data) => {
    console.log('onsubmit', data);
    const code = signup.getValues('phoneCode')
    // console.log(code)
    onSubmitted(2, data);
    onNext();
  };

  const onError = (err) => {
    console.log("❌ Validation errors:", err);
  };

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
  };
  const handleTabChange = (method) => {
    signup.setValue("contactMethod", method);
  };

  return (
    <div className='flex flex-col gap-6 justify-start items-start w-full overflow-y-auto'>
      <h2 className='capitalize text-4xl font-semibold'>Tell us your story</h2>
      <p className='text-[#B0B0B0] font-normal text-lg'>Share details about what you want to express in your custom tune</p>
      <form onSubmit={signup.handleSubmit(onSubmit, onError)} className='justify-center items-center flex-col w-full gap-6 space-y-6'>
        <CustomInputField label={`Recipient's Name`} placeholder='Enter Name' errors={signup.formState.errors} {...signup.register('name')} type={'name'} />
        {/* Relationship to You */}
        <Controller
          control={signup.control}
          name="relationship"
          render={({ field }) => (
            <div className="w-full items-start gap-3 flex flex-col">
              <Label htmlFor="relationship"
                className="font-normal">Relationship to You</Label>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedRelationship(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={field.value || "Select relationship" || selectedRelationship}
                  />
                </SelectTrigger>
                <SelectContent>
                  {SelectItems.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {signup.formState.errors.relationship && (
                <p className="text-red-500 text-sm">{signup.formState.errors.relationship.message}</p>
              )}
            </div>
          )}
        />
        {selectedRelationship === 'Others' &&
          <CustomInputField label={null} placeholder='Enter your relationship' errors={signup.formState.errors} {...signup.register('relationshipValue')} type={'relationshipValue'} />}
        {/* tabs */}
        <Tabs defaultValue={tabDefaultValue} value={contactMethod}
          onValueChange={handleTabChange}
          className={'w-full gap-7'}>
          <TabsList className="w-full bg-transparent gap-3">
            <TabsTrigger
              value="whatsapp"
              onClick={() => {
                handleTabClick(1);
              }}
              style={{
                borderColor: `${currentTab === 1 ? '#d27461' : 'transparent'}`,
              }}
              className={`text-sm font-normal border-2 text-white py-5 transition ease-in duration-150`}
            >
              WhatsApp
            </TabsTrigger>
            <TabsTrigger
              value="email"
              onClick={() => {
                handleTabClick(2);
              }}
              style={{
                borderColor: `${currentTab === 2 ? '#d27461' : 'transparent'}`,
              }}
              className={`text-sm font-normal border-2 text-white py-5 transition ease-in duration-150`}
            >
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="whatsapp">
            <div className='flex flex-row justify-center items-center gap-1'>
              <PhoneCode signupForm={signup} />
              <CustomInputField
                label={''}
                placeholder='Enter your WhatsApp number'
                errors={signup.formState.errors} type={'phone'}
                {...signup.register('phone', {
                  required: contactMethod === 'whatsapp' // Only required if 'whatsapp' is selected
                })}
              />
            </div>
          </TabsContent>
          <TabsContent value="email">
            <CustomInputField
              label={''}
              placeholder='Enter your Email'
              errors={signup.formState.errors}
              {...signup.register('email', {
                required: contactMethod === 'email', // Only required if 'email' is selected
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address"
                }
              })}
              type={'email'}
            />
          </TabsContent>
        </Tabs>
        <input type="hidden" value={contactMethod} {...signup.register('contactMethod')} />
        <CustomTextArea
          label={`Special Memories or Inside Jokes (optional)`}
          type={'memories'}
          {...signup.register('memories')}
          errors={signup.formState.errors}
          placeholder={'Share any special memories or inside jokes you would like to include'} />
        <CustomTextArea
          label={`Background Story`}
          type={'backgroundStory'}
          {...signup.register('backgroundStory')}
          errors={signup.formState.errors}
          placeholder='Share any relevant background information or memories that could inspire the song' />
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={() => {
              onPrev();
            }}
            className="px-4 py-2 border-[2px] border-white rounded-lg transition-all duration-300 cursor-pointer"
          >
            Back
          </Button>
          <Button
            disabled={signup.formState.isLoading}
            type="submit"
            className="px-4 py-2 bg-[#FF7E6E] text-white
            rounded-lg transition-all duration-300
             hover:bg-[#ff6b58] cursor-pointer"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

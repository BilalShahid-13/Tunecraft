import CustomInputField from '@/components/CustomInputField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
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
import useQuestionStore from '@/store/questionStore';
import { useEffect, useState } from 'react';
import PhoneCode from '@/app/Questions/_components/PhoneCode';

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
    relationship: z.enum(SelectItems, {
      required_error: "Please select a relationship",
    }),
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
    }
  });

const CustomTextArea = ({ label, placeholder, cn }) => {
  return (
    <div className='flex flex-col gap-3 w-full'>
      <Label htmlFor={label} className={'font-normal'}>{label}</Label>
      <Textarea id={label} placeholder={placeholder} className={'h-24 w-full max-sm:text-sm'} />
    </div>
  );
};

export default function Step2({ onNext, onPrev }) {
  const { register, handleSubmit, control, setValue,
    formState: { errors, isLoading }, watch } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { contactMethod: "whatsapp" }
    });
  const [currentTab, setCurrentTab] = useState(1);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [userData, setUserData] = useState({});
  const { onSubmitted, formData } = useQuestionStore();
  const contactMethod = watch("contactMethod");
  const [tabDefaultValue, setTabDefaultValue] = useState('whatsapp')
  const relationship = watch("relationship");
  useEffect(() => {
    if (formData.step2) {
      setUserData(formData.step1);
      Object.entries(formData.step2).forEach(([key, value]) => {
        setValue(key, value);
      });
      setTabDefaultValue(formData.step2.contactMethod === 'whatsapp' ? 'whatsapp' : 'email')
      // setCurrentTab(formData.step2.contactMethod === 'whatsapp' ? 1 : 2)
      if (formData.step2.contactMethod === 'whatsapp') {
        setCurrentTab(1)
      } else if (formData.step2.contactMethod === 'email') {
        setCurrentTab(2)
      }
      if (formData.step2.relationship) {
        setValue("relationship", formData.step2.relationship || "Parent");
        setValue("relationshipValue", formData.step2.relationshipValue || "");
        setSelectedRelationship(formData.step2.relationship || "Parent");
        console.log("formData.step2", formData.step2.relationship);
      }
    }
  }, [formData, setValue]);

  const onSubmit = (data) => {
    console.log(data);
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
    setValue("contactMethod", method);
  };

  return (
    <div className='flex flex-col gap-6 justify-start items-start w-full'>
      <h2 className='capitalize text-4xl font-semibold'>Tell us your story</h2>
      <p className='text-[#B0B0B0] font-normal text-lg'>Share details about what you want to express in your custom tune</p>
      <form onSubmit={handleSubmit(onSubmit, onError)} className='justify-center items-center flex-col w-full gap-6 space-y-6'>
        <CustomInputField label={`Recipient's Name`} placeholder='Enter Name' errors={errors} {...register('name')} type={'name'} />
        {/* Relationship to You */}
        <Controller
          control={control}
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
              {errors.relationship && (
                <p className="text-red-500 text-sm">{errors.relationship.message}</p>
              )}
            </div>
          )}
        />
        {selectedRelationship === 'Others' &&
          <CustomInputField label={null} placeholder='Enter your relationship' errors={errors} {...register('relationshipValue')} type={'relationshipValue'} />}
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
              <PhoneCode />
              <CustomInputField
                label={''}
                placeholder='Enter your WhatsApp number'
                errors={errors} type={'phone'}
                {...register('phone', {
                  required: contactMethod === 'whatsapp' // Only required if 'whatsapp' is selected
                })}
              />
            </div>
          </TabsContent>
          <TabsContent value="email">
            <CustomInputField
              label={''}
              placeholder='Enter your Email'
              errors={errors}
              {...register('email', {
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
        <input type="hidden" value={contactMethod} {...register('contactMethod')} />
        <CustomTextArea
          label={`Special Memories or Inside Jokes (optional)`}
          placeholder={'Share any special memories or inside jokes you would like to include'} />
        <CustomTextArea
          label={`Background Story`}
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
            disabled={isLoading}
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

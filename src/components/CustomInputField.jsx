import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

export default function CustomInputField({
  errors, type, label = 'First Name', placeholder = 'email', value, className, ...props }) {
  return (
    <>
      <div className="grid w-full items-start item-start text-left gap-3">
        {label && <Label htmlFor={label}
          className={'font-normal'}>{label}</Label>}
        <Input id={label} {...props} type={type} value={value}
          className={cn(`py-5 placeholder:text-xs`, className)} placeholder={placeholder} />
        {errors && errors[type] &&
          <p className='text-red-400 text-xs font-montserrat lowercase '>{errors[type]?.message}</p>}
      </div>
    </>
  )
}

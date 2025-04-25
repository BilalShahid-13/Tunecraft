import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'

export default function CustomInputField({
  errors, type, label = 'First Name', placeholder = 'email', value, ...props }) {
  return (
    <>
      <div className="grid w-full items-start item-start text-left gap-3">
        {label && <Label htmlFor={label}
          className={'font-normal'}>{label}</Label>}
        <Input id={label} {...props} type={type} value={value}
          className={'py-5 placeholder:text-xs'} placeholder={placeholder} />
        {errors && errors[type] &&
          <p className='text-red-400 text-xs font-montserrat lowercase '>{errors[type]?.message}</p>}
      </div>
    </>
  )
}

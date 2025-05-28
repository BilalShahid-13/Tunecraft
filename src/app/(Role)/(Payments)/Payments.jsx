import React from 'react'
import PaymentCard from './components/PaymentSummary'
import { PaymentHistory } from './components/PaymentHistory'

export default function Payments() {
  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-3xl font-inter font-bold'>Payments</h1>
      <PaymentCard />
      <PaymentHistory />
    </div>
  )
}

"use client";
import fetchPaymentHistory from '@/components/serverComponents/paymentAction';
import { Skeleton } from '@/components/ui/skeleton';
import usePaymentStore from '@/store/payment';
import { useEffect, useState } from 'react';
import { PaymentHistory } from './components/PaymentHistory';
import PaymentCard from './components/PaymentSummary';

export default function Payments() {
  const { addPayments } = usePaymentStore();
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPaymentHistory();
      addPayments(data);
    } catch (err) {
      console.error("fetch payment failed", err);
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-3xl font-inter font-bold'>Payments</h1>
      <PaymentCard />
      {isLoading ? <Skeleton className="h-[80px] w-full" /> : <PaymentHistory />}
    </div>
  );
}

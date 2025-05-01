"use client";
import { Confetti } from '@/components/magicui/confetti';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import useQuestionStore from '@/store/questionStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function AlmostDone({ onNext, onPrev }) {
  const { formData } = useQuestionStore();
  const [data, setData] = useState(null);
  const confettiRef = useRef(null);
  const navigate = useRouter()
  const [buttonOnClick, setButtonOnClick] = useState(false)
  const [price, SetPrice] = useState(0)
  useEffect(() => {
    if (formData) {
      const numericPrice = Number(formData.step3.planPrice.replace('MX$', '')); // 2.299
      setData(formData.step3);
      SetPrice(numericPrice)
    }
  }, [formData]);

  console.log(formData)

  // Function to trigger confetti on button click
  const handleProceedToPayment = () => {
    setButtonOnClick(!buttonOnClick)
    navigate.push('/Payment')
  };

  useEffect(() => {
    confettiRef.current?.fire({});
  }, [buttonOnClick])

  return (
    <>
      <div className='relative flex flex-col gap-3 max-sm:gap-5 justify-start items-start
      max-sm:justify-center max-sm:items-center font-inter'>
        <h2 className="text-3xl capitalize font-semibold">Almost Done!</h2>
        <p className="text-lg text-[#B0B0B0] max-sm:text-center">Review your package and proceed to payment</p>
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
        />
        <Card className={'w-[450px] max-sm:w-[300px] px-2 border-neutral-400 mt-4'}>
          <CardHeader>
            <CardTitle className={'font-inter font-medium text-lg'}>Selected Package: {data?.placeName}</CardTitle>
            <CardDescription>
              <ol className='list-disc my-custom-list'>
                {data?.points?.map((item, index) =>
                  <li className='marker:text-[#d27461] text-sm text-neutral-400 leading-7' key={index}>{item}</li>
                )}
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent className={'flex flex-col gap-1'}>
            <div className='flex flex-row justify-between items-center'>
              <h2 className='font-semibold text-xl'>Total:</h2>
              <h2 className='font-bold text-xl text-[#FF7E6E]'>${price}</h2>
            </div>
          </CardContent>
        </Card>

      </div >
      <Button
        className={'my-3 bg-[#FF7E6E] hover:bg-red-400 text-white text-sm font-normal py-5 w-full z-20'}
        onClick={handleProceedToPayment} // Trigger confetti when clicking button
      >
        Proceed to Payment
      </Button>
      <Button
        className={'my-3 border-[#B0B0B0] max-sm:w-full border-[1px] px-5 hover:bg-neutral-900 cursor-pointer bg-transparent text-white text-sm font-normal py-5'}
        onClick={(e) => {
          e.preventDefault();
          onPrev();
        }}
      >
        Back
      </Button>

      {/* <Congrats buttonClick={buttonOnClick} /> */}


    </>
  );
};

"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Currency } from '@/lib/Constant';
import useQuestionStore from '@/store/questionStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

export default function AlmostDone({ onNext, onPrev }) {
  const { formData } = useQuestionStore();
  const [data, setData] = useState(null);
  const confettiRef = useRef(null);
  const navigate = useRouter()
  const [buttonOnClick, setButtonOnClick] = useState(false)
  const [price, SetPrice] = useState(0)
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (formData) {
      const numericPrice = Number(formData.step3.planPrice.replace('MX$', '')); // 2.299
      setData(formData.step3);
      SetPrice(numericPrice)
    }
  }, [formData]);

  console.log(formData)

  // Function to trigger confetti on button click
  const handleProceedToPayment = async () => {
    startTransition(() => {
      navigate.push("/Payment");
      setButtonOnClick(!buttonOnClick)
    });
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
        <Card className={'w-[450px] max-sm:w-[300px] px-2 border-neutral-400 mt-4'}>
          <CardHeader>
            <CardTitle className={'font-inter font-medium text-lg'}>Selected Package: {data?.placeName}</CardTitle>
            <CardDescription>
              <Accordion type="single" collapsible
                className='w-full cursor-pointer'
              >
                <AccordionItem value="item-1"
                >
                  <AccordionTrigger>Subscription Plan</AccordionTrigger>
                  <AccordionContent>
                    {data?.points?.map((item, index) =>
                      <li className='marker:text-[#d27461] text-sm text-neutral-400 leading-7' key={index}>{item}</li>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Music Template</AccordionTrigger>
                  <AccordionContent>
                    <h6 className='font-semibold text-xl font-inter my-1'> {formData?.step4?.musicTitle}</h6>
                    <h6 className='font-light text-sm font-inter my-1 ml-4 text-neutral-400'> {formData?.step4?.musicCategory}</h6>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardDescription>
          </CardHeader>
          <CardContent className={'flex flex-col gap-1'}>
            <div className='flex flex-row justify-between items-center'>
              <h2 className='font-semibold text-xl'>Total:</h2>
              <h2 className='font-bold text-xl text-[#FF7E6E]'>{Currency}{price}</h2>
            </div>
          </CardContent>
        </Card>


      </div >
      <Button
        className={'my-3 bg-[#FF7E6E] hover:bg-red-400 text-white text-sm font-normal py-5 w-full z-20 cursor-pointer'}
        onClick={handleProceedToPayment} // Trigger confetti when clicking button
      >
        {isPending ? <Loader2 className='animate-spin' /> : 'Proceed to Payment'}
        {/* Proceed to Payment */}
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
    </>
  );
};

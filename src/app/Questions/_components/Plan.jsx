"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { TunesItem } from '@/lib/Constant';
import useQuestionStore from "@/store/questionStore";

export default function Plan({ onNext, onPrev }) {
  const { setSelected, selectedIndex, onSubmitted, } = useQuestionStore();

  const OnSubmit = (index, items) => {
    setSelected({ disabled: false, index: index });
    onSubmitted(3, {
      planPrice: items.price,
      placeName: items.heading,
      points: items.points
    })
  }

  return (
    <div className='flex flex-col justify-start items-start gap-5 w-full
      max-sm:justify-center max-sm:items-center'>
      <h2 className="text-3xl capitalize font-semibold">choose your plan</h2>
      <p className="text-sm font-light">Select the plan that best fits your needs and budget</p>
      <div className='grid grid-cols-2 max-sm:grid-cols-1
       max-md:grid-cols-1 max-lg:grid-cols-1 mt-2
       max-sm:justify-center max-sm:items-center
       w-full gap-x-10 justify-start items-start gap-y-8
      '>
        {TunesItem.map((items, index) => (
          <Card key={index}
            onClick={() => {
              OnSubmit(index, items)
            }}
            className={`w-[450px] max-sm:w-full h-full flex justify-start items-start
               max-sm:justify-center max-sm:items-center
            ${selectedIndex === index ? 'border-[1px] border-[#FF7E6E]' : ''}
            transition duration-200 ease-in cursor-pointer`}>
            <CardHeader className={'w-full justify-start items-start'}>
              <CardTitle className={'font-normal text-3xl'}>{items.heading}</CardTitle>
              <CardDescription className={' text-sm font-light'}>{items.des}</CardDescription>
            </CardHeader>
            <CardContent className={'flex flex-col gap-4'}>
              <h2 className='text-4xl font-semibold text-left'>{items.price}</h2>
              {items.points.map((items, index) =>
                <ul key={index}>
                  <li className='text-left text-sm text-white/70
                  list-disc lowercase'>{items}</li>
                </ul>)}
            </CardContent>
          </Card>
        ))
        }
      </div>
      <div className='flex flex-row justify-between items-center w-full'>
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
          disabled={selectedIndex === null ? true : false}
          type="submit"
          onClick={() => onNext()}
          className="px-4 py-2 bg-[#FF7E6E] text-white
            rounded-lg transition-all duration-300
             hover:bg-[#ff6b58] cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

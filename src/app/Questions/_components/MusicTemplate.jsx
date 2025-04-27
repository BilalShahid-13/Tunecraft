"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { musicTemplates, TunesItem } from "@/lib/Constant";
import useQuestionStore from "@/store/questionStore";
import { useEffect, useState } from "react";

export default function MusicTemplate({ onNext, onPrev }) {
  const { setSelected, selectedIndex, onSubmitted, formData } = useQuestionStore();
  const [selectedCard, setSelectedCard] = useState(null)
  const [premiumCards, setPremiumCards] = useState(null)

  useEffect(() => {
    if (formData) {
      const index = TunesItem.findIndex((item) => item.heading === formData.step3.placeName);
      setSelectedCard(formData.step4.step);
      setPremiumCards((index + 1) * 2)
    }
  }, [formData])

  console.log('====================================');
  console.log(selectedCard);
  console.log('====================================');


  const OnSubmit = (index, items) => {
    setSelected({ disabled: false, index: index });
    onSubmitted(4, {
      step: index,
      musicTitle: items.title,
      musicCategory: items.category,
    })
  }

  return (
    <div className='flex flex-col justify-start items-start
    max-sm:justify-center max-sm:items-center
    gap-5 w-full'>
      <h2 className="text-3xl capitalize font-semibold max-sm:text-center max-sm:text-2xl">Choose a Music Template</h2>
      <p className="text-sm font-light">Select a template that best fits the occasion and emotion you want to express.</p>
      <div className={`grid mt-2
      ${premiumCards <= 2 ? 'grid-cols-1' : 'grid-cols-2'} max-sm:grid-cols-1
      max-md:grid-cols-1 max-lg:grid-cols-1
       w-full gap-x-10 justify-start items-start gap-y-8`}>
        {musicTemplates.slice(0, premiumCards).map((items, index) => (
          <Card key={index}
            onClick={() => {
              OnSubmit(index, items)
            }}
            className={` ${premiumCards <= 2 ? 'w-full' : 'w-[350px]'} h-full flex justify-start items-start
              max-sm:justify-center max-sm:items-center
            ${selectedCard === index ? 'border-[1px] border-[#FF7E6E]' : ''}
            transition duration-200 ease-in cursor-pointer`}>
            <CardHeader className={'w-full justify-start items-start'}>
              <CardTitle className={'font-normal text-3xl'}>{items.title}</CardTitle>
              <CardDescription className={' text-sm font-light'}>{items.category}</CardDescription>
            </CardHeader>
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
          disabled={selectedCard >= 0 ? false : true}
          onClick={() => onNext()}
          type="submit"
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

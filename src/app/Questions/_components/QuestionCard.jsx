"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { QuestionsItem } from '@/lib/Constant'
import useQuestionStore from "@/store/questionStore"
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function QuestionCard({ onNext, onPrev }) {
  const [selectedCard, setSelectedCard] = useState(null)
  const { setSelected, selectedIndex, onSubmitted, formData } = useQuestionStore()

  useEffect(() => {
    if (formData) {
      setSelectedCard(formData.step1.step);
    }
  }, [formData]);

  const OnSubmit = (index, items) => {
    setSelected(false)
    console.log(selectedCard, index)
    setSelected({ disabled: false, index: index });
    onSubmitted(1, {
      step: index,
      question: items.question,
      des: items.des,
    })
  }

  return (
    <div className="font-inter flex flex-col gap-4 max-sm:justify-center max-sm:items-center">
      <div className="font-inter flex flex-col font-semibold
      max-sm:justify-center max-sm:items-center
       justify-start items-start gap-3 pt-3 pl-3">
        <h2 className="text-2xl">What type of song are you looking for?</h2>
        <p className="text-sm font-light">Select the template that best fits your needs</p>
      </div >
      <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-6 justify-center
      items-center max-sm:justify-center max-sm:items-center max-lg:w-full
      '>
        {QuestionsItem.map((items, index) =>
          <Card key={index}
            className={`border-gray-500 transition
              w-[300px] max-sm:w-full max-lg:w-full
              duration-200 ease-in cursor-pointer h-full
            ${selectedCard === index ? 'border-[#d27461]' : ''}`}
            onClick={() => {
              OnSubmit(index, items)
            }}
          >
            <CardHeader
              className={'flex flex-col justify-start items-start text-left gap-5'}>
              <div className='w-12 h-12 bg-[#ff7f6e58]
               bg-opacity-20 rounded-md flex
               justify-center items-center'>
                <Image
                  src={items.img}
                  width={20}
                  height={20}
                  alt={items.question}
                  className='object-cover'
                />
              </div>

              <CardTitle className={'text-2xl font-semibold'}>{items.question}</CardTitle>
              <CardDescription>{items.des}</CardDescription>
            </CardHeader>
          </Card>)}

      </div >
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
    </div >
  )
}

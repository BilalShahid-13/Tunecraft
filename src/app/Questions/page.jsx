"use client";
import Stepper from '@/components/Stepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { useEffect, useState } from 'react';
import AlmostDone from './_components/AlmostDone';
import MusicTemplate from './_components/MusicTemplate';
import Plan from './_components/Plan';
import QuestionCard from './_components/QuestionCard';
import Step2 from './_components/Step2';


const CustomTabComponent = ({ onNext, onPrev, Component }) => {
  return (
    <Component onNext={onNext} onPrev={onPrev} />
  );
};

export default function Page() {
  const Items = [1, 2, 3, 4, 5];
  const StepsComponents = [
    QuestionCard,
    Step2,
    Plan,
    MusicTemplate,
    AlmostDone,
  ]
  const [currentTab, setCurrentTab] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    const currentIndex = Items.indexOf(currentTab);
    const nextIndex = Math.min(currentIndex + 1, Items.length - 1);
    setCurrentTab(Items[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = Items.indexOf(currentTab);
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentTab(Items[prevIndex]);
    console.log('Prev clicked', prevIndex); // Add logging
  };

  useEffect(() => {
    async function ConnectDB() {
      try {
        const response = await axios.get('/api/test')
        if (response)
          console.log(response)
      } catch (error) {
        console.error(error);

      }
    }
    ConnectDB()
  }, [])


  useEffect(() => {
    if (currentTab)
      setActiveStep(currentTab - 1)
  }, [currentTab])



  return (
    <div className="flex flex-col items-center
    max-sm:justify-start max-sm:items-start max-sm:h-screen
    max-lg:gap-y-14
    max-sm:overflow-auto max-sm:gap-y-14 max-sm:mt-12 max-lg:mt-12
    justify-center gap-6 w-full px-4 overflow-hidden">

      {/* Stepper */}
      <div className="w-full flex justify-center
      items-center max-sm:pl-4 max-lg:pl-22">
        <Stepper currentStep={activeStep} />
      </div>

      <Tabs value={currentTab.toString()}
        onValueChange={(val) => setCurrentTab(Number(val))}
        className="w-fit justify-center items-center px-6
         flex flex-col gap-6 bg-[#111111] shadow-2xl
          shadow-zinc-700  py-5 rounded-lg">
        {/*  max-w-xl */}
        {/* Hide triggers if not needed */}
        <TabsList
        className="hidden"
        >
          {Items.map((items, index) =>
            <TabsTrigger key={index}
              value={String(items)} />)}
        </TabsList>

        {StepsComponents.map((items, index) =>
          <TabsContent key={index} value={String(index + 1)}>
            <CustomTabComponent key={index}
              Component={items}
              onNext={handleNext} onPrev={handlePrev} />
          </TabsContent>)}
      </Tabs>
    </div>
  );
}

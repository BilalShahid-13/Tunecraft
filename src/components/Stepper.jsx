"use client";
import { useEffect, useState } from 'react';



export default function Stepper({ currentStep }) {
  const items = [1, 2, 3, 4, 5];
  const [activeStep, setActiveStep] = useState(currentStep);


  useEffect(() => {
    setActiveStep(currentStep)
  }, [currentStep])

  return (
    <div className="flex justify-center items-center flex-col gap-4 w-full">
      <ol className="flex justify-center items-center w-full max-w-2xl">
        {items.map((item, index) => {
          const isCircleActive = index === activeStep;
          const isLineActive = index < activeStep;
          const isLast = index === items.length - 1;
          const isCompleted = index < activeStep;

          return (
            <li
              key={index}
              className={`flex items-center w-full relative ${!isLast
                ? "after:content-[''] after:w-full after:h-0.5 after:inline-block after:transition-colors after:duration-300 " +
                (isLineActive
                  ? "after:border-[#FF7E6E] after:border-2"
                  : "after:border-[#B0B0B0] after:border-2")
                : ""
                }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 lg:h-12 lg:w-12 rounded-full border-2 shrink-0 text-2xl
              transition-colors duration-300
              ${isCircleActive
                    ? "text-[#FF7E6E] border-[#FF7E6E]"
                    : isCompleted
                      ? "text-[#FF7E6E] border-[#FF7E6E]"
                      : "text-[#B0B0B0] border-[#B0B0B0]"
                  }`}
              >
                {item}
              </div>
            </li>
          );
        })}
      </ol>
    </div>


  );
}

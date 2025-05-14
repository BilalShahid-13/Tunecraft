import { cn } from '@/lib/utils';
import React from 'react'

export default function SubscriptionCard({ heading, des, price, list, gradientColor, children, className }) {
  return (
    <>
      <Border gradientColor={gradientColor} className={className} >
        <div
          className={cn(`relative px-12 py-5
           text-white rounded-[52px] rounded-t-xl
          ${children ? 'max-sm:px-4' : 'px-12'}
            flex flex-col gap-4`)}
        >
          <div className='-mt-10 z-20 w-full
          bg-gradient-to-r from-black/90 from-5%
           via-black via-90% to-black/90 to-5%'>
            <h1
              className="text-5xl font-bold text-center uppercase max-sm:text-xl bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(${gradientColor})`
              }}
            >
              {heading}
            </h1>
          </div>

          {!children ? (
            <>
              <div className="flex justify-between items-center max-sm:justify-center max-sm:flex-col max-sm:gap-5">
                <p>{des ?? null}</p>
                <h6
                  className="text-4xl max-sm:text-3xl font-normal bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(${gradientColor})`
                  }}
                >
                  {price ?? null}
                </h6>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {list?.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </>
          ) : (
            children // Properly render the children passed to the component
          )}
        </div>
      </Border>
    </>
  );
}


const Border = ({ children, gradientColor, className }) => {
  return (
    <div
      className={cn(`p-[1px] rounded-xl max-sm:mx-5`, className)}
      style={{
        background: `linear-gradient(${gradientColor})`,
      }}
    >
      <div className="bg-black rounded-xl h-full">
        {children}
      </div>
    </div >

  )
}

import GradientText from '@/components/GradientText';
import { TunesItem } from '@/lib/Constant'
import React from 'react'
import GradientButton from '@/components/CustomButton';

const CustomButton = ({ heading, des, price, list, gradientColor }) => {
  return (
    <Border gradientColor={gradientColor}>
      <div
        className="relative px-12 py-5
text-white rounded-[52px] rounded-t-xl flex flex-col gap-4"
      >
        <div className='-mt-10 z-20 w-full
        bg-gradient-to-r from-black/90 from-5%
         via-black via-90% to-black/90 to-5%'>
          <h1
            className="text-5xl font-bold
     text-center uppercase max-sm:text-xl
   bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(${gradientColor})`
            }}
          >
            {heading}
          </h1>
        </div>

        <div className="flex justify-between items-center max-sm:justify-center max-sm:flex-col max-sm:gap-5"
        >
          <p>{des}</p>
          <h6 className="text-4xl max-sm:text-3xl
          font-normal bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(${gradientColor})`
            }}>{price}</h6>
        </div>
        <ul className="list-disc list-inside space-y-1">
          {list.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </Border>
  );
};


const Border = ({ children, gradientColor }) => {
  return (
    <div
      className="p-[1px] rounded-xl max-sm:mx-5"
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



export default function Tunes() {

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <GradientText txt={'our tunes'}
        className={'uppercase text-7xl font-medium mb-8 max-sm:text-4xl'} />
      <div className="grid grid-cols-2 max-md:grid-cols-1
       gap-12 max-sm:grid-cols-1 max-sm:gap-16
       max-lg:grid-cols-1">
        {TunesItem.map((items, key) => (
          <CustomButton
            key={key}
            gradientColor={items.gradientColor}
            heading={items.heading}
            des={items.des}
            price={items.price}
            list={items.points}
          />
        ))}
      </div>
      <GradientButton />
    </div>

  )
}

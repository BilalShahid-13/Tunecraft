import React from 'react'
import Star from '../../../../public/Star 9.png';
import Image from 'next/image';
import Carousel from '@/components/Carousel';
import CustomButton from '@/components/CustomButton';
import GradientText from '@/components/GradientText';

const StarImage = ({ ref, cn }) => {
  return (
    <div className={`absolute ${cn}`} ref={ref}>
      <Image
        src={Star}
        alt="ellipse"
        fill
        priority
        className="object-cover" // or object-cover, depending on your need
      />
    </div>
  )
}
export default function Transform() {
  return (
    <div className='flex flex-col items-center
     justify-center relative max-sm:gap-3'>
      <GradientText txt='We transform your emotions into songs.'
        className={'heading-1 uppercase w-[90%]'}
      />
      <Carousel />
      {/* <CustomButton /> */}

      <StarImage cn={`right-0 -z-10 w-18 h-18 ml-[46%] mt-5
        max-md:top-4 max-sm:top-0`} />
      <StarImage cn={'right-[25%] -z-10 w-10 h-10 mt-[15%] max-md:top-4 max-md:-left-10 max-sm:top-4'} />
      <StarImage cn={'left-0 -z-10 w-18 h-18 ml-[6%] mt-5 max-md:top-4 max-sm:-mt-3 max-md:-ml-2'} />
      <StarImage cn={'left-[25%] -z-10 w-10 h-10 mt-[20%] max-md:top-4'} />

    </div>
  )
}

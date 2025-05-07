"use client"
import GradientText from '@/components/GradientText'
import Image from 'next/image'
import EclipsePng from '../../../../public/Group 4.png'

import SoundWaveAnimation from '@/components/SoundWaveAnimation'


export default function About() {
  return (
    <>
      <div className=' grid grid-flow-col max-sm:grid-rows-3
       max-sm:flex max-sm:flex-col font-poppins
       max-md:flex max-md:flex-col max-lg:flex-col max-lg:flex
       max-xl:flex max-xl:flex-col max-xl:gap-44
       max-sm:justify-center max-sm:items-center
       justify-center items-center gap-21 max-sm:gap-10 relative'
        id='about-us'>
        <div className={'relative w-[500px] h-[500px] max-sm:w-[300px] max-xl:w-[600px] max-xl:h-[600px] max-sm:h-[300px] max-xl:z-10'}>
          <Image
            src={EclipsePng}
            alt="ellipse"
            fill
            priority
            className="object-cover"
          />
        </div>
        <SoundWaveAnimation
          className={`absolute w-[35%] left-[20%] max-md:rotate-0 max-lg:rotate-0 max-sm:mt-0
            max-xl:rotate-0 max-xl:w-full max-xl:left-0 max-xl:-z-10 max-xl:mt-32
          rotate-90 max-sm:rotate-0 max-sm:w-[100%] max-md:w-full max-lg:w-[100%]
          max-sm:relative max-sm:left-0 max-md:left-0 max-lg:left-0`} />
        <div className='flex flex-col justify-center items-center gap-12'>
          <GradientText txt='about us'
            // className={'uppercase text-7xl max-sm:text-4xl font-medium'}
            className={'heading-1 uppercase'}
          />
          <p className='text-[24px] font-medium max-sm:text-xl text-left max-sm:text-left max-sm:px-4'>At Tunecraft, we are a passionate team of Mexican musicians and composers dedicated to turning your most precious moments into unforgettable songs. </p>
          <p className='text-[24px]  font-normal max-sm:text-xl max-sm:px-4'>Founded by a group of music lovers and industry experts, our mission is to capture the essence of your stories and emotions, creating personalized melodies that will resonate in your heart and the hearts of your loved ones.</p>
        </div>
      </div >
    </>
  )
}

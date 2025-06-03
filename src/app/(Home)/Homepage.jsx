"use client";
import CustomButton from '@/components/CustomButton';
import SoundWaveAnimation from '@/components/SoundWaveAnimation';
import { TunesItem } from '@/lib/Constant';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Eclipse from '../../../public/heroSection/Ellipse 26.png';
// import
const Homepage = () => {
  const navigate = useRouter()
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (navigate?.query?.scrollTo) { // Check if scrollTo exists
      const element = document.getElementById(navigate.query.scrollTo);
      console.log('element', element, navigate?.query?.scrollTo)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  const extractPrice = (price) => {
    const result = price.match(/\d+/); // Match numbers
    return result ? result[0] : null; // Return the matched number
  };

  const handleNavigate = async () => {
    startTransition(() => {
      navigate.push("/Questions");
    })
  };

  return (
    <div>
      <div className='relative justify-center items-center flex flex-col gap-18 max-sm:gap-18 pt-12'>
        <h2 className='heading-1 w-[80%] mt-6'>
          Create Musical Magic For Every Occasion
        </h2>
        <CustomButton
          onClick={handleNavigate}
          isLoading={isPending}
        />
        <SoundWaveAnimation />
        {/* eclipse img */}
        <div className="absolute right-0 top-0 -z-10 w-[400px] h-[300px] py-4 rounded-full">
          <Image
            src={Eclipse}
            alt="ellipse"
            fill
            quality={20}
            className="object-cover" // or object-cover, depending on your need
          />
        </div>

      </div>
    </div>
  )
}

export default Homepage

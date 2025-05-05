"use client";
import CustomButton from '@/components/CustomButton';
import SoundWaveAnimation from '@/components/SoundWaveAnimation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Eclipse from '../../../public/heroSection/Ellipse 26.svg';
// import
const Homepage = () => {
  const navigate = useRouter()
  return (
    <div>
      <div className='relative justify-center items-center flex flex-col gap-18 max-sm:gap-18 pt-12'>
        <h2 className='heading-1 w-[80%] mt-6'>
          Create Musical Magic For Every Occasion
        </h2>
        <CustomButton onClick={() => navigate.push('/Questions')} />
        <SoundWaveAnimation />
        {/* eclipse img */}
        <div className="absolute right-0 top-0 -z-10 w-[400px] h-[300px] py-4 rounded-full">
          <Image
            src={Eclipse}
            alt="ellipse"
            fill
            priority
            className="object-cover" // or object-cover, depending on your need
          />
        </div>
        {/* FF5B46 */}

      </div>
    </div>
  )
}

export default Homepage

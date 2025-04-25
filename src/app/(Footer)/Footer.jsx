"use client";
import { FooterLinks } from '@/lib/Constant'
import Image from 'next/image'
import React from 'react'
import backgroundImage from '../../../public/footer/footer.svg'

export default function Footer() {
  return (
    <>
      <div className='grid grid-cols-3
      max-sm:flex max-sm:flex-col max-sm:gap-8
       justify-start h-fit px-8 py-4 font-poppins mt-34'
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
        }}>
        <div className='flex flex-col items-start
      justify-start gap-4  z-20'>
          <h2 className='text-[#FF7E6E] uppercase max-sm:w-full
     font-bold text-3xl max-sm:text-xl max-sm:text-center'>tunecraft</h2>
          <h2 className='text-white uppercase
          text-xl max-sm:text-lg font-semibold max-sm:font-medium
        '>contacts</h2>
          <p>Address: Calle de la Música, 45, 28013 Madrid, Spain</p>
          <p>
            Email: <a href="mailto:contact@tunecraft.es"
              className="bg-gradient-to-l from-[#FF7E6E]
           to-[#FF4F79] decoration-0
           bg-clip-text text-transparent">contact@tunecraft.es</a>
          </p>
          <p>
            Phone: <a href="tel:+34123456789" className="text-white decoration-0">+34 123 456 789</a>
          </p>

        </div>
        <div className='flex flex-col items-end col-span-2
        max-md:text-right
      justify-start gap-4 max-sm:justify-center max-sm:items-center'>
          <h2 className='text-[#FF7E6E] uppercase z-20 max-sm:text-xl
     font-extrabold text-3xl'>Music that gives emotions</h2>
          <div className='flex flex-row items-center justify-center gap-4'>
            {FooterLinks.map((item, index) => (
              <div key={index}
                className='justify-center items-center flex flex-row gap-1 capitalize z-20'>
                <Image
                  src={item.icon}
                  width={20}
                  height={50}
                  alt={`icon-${index}`}
                />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-center w-full col-span-3
       text-gray-100/50 font-medium'>Ⓒ 2025. All rights reserved.</p>
      </div >
    </>
  )
}

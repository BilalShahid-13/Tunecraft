"use client";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP)
export default function BorderButton({ txt = "Create your own tune", className }) {
  const buttonRef = useRef()

  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1, // loops forever
      defaults: {
        duration: 3,
        yoyo: true,
        ease: "power2.inOut",
      },
    });

    tl.to(buttonRef.current, {
      borderLeftColor: "#fb2c36",
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
    })
      .to(buttonRef.current, {
        borderTopColor: "#fb2c36",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
      })
      .to(buttonRef.current, {
        borderRightColor: "#fb2c36",
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
      })
      .to(buttonRef.current, {
        borderBottomColor: "#fb2c36",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderLeftColor: "transparent",
      });
  });
  return (
    <>
      <Button ref={buttonRef}
        className={cn(`capitalize bg-black rounded-full
           text-white py-6 px-7 hover:bg-black
        font-medium text-[20px] border-[2px]
        max-xl:py-10 max-xl:px-12 max-xl:text-3xl
        max-md:text-lg max-lg:text-3xl max-lg:py-10
        max-sm:text-sm max-sm:py-3 max-sm:px-5
         border-transparent border-solid`, className)}>
        {txt}
      </Button>
    </>
  )
}

"use client"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';


gsap.registerPlugin(useGSAP)
export default function CustomButton(
  { text = 'Create your own tune',
    onClick = () => { },
    isLoading = false }) {
  const buttonRef = useRef()
  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1, defaults: {
        duration: 3, ease: 'power4.inOut'
      }
    });
    tl.to(buttonRef.current, {
      backgroundImage: "linear-gradient(90deg, #ff7e6e, #ffa2a2)",
      backgroundPosition: "100% 50%",
    }).to(buttonRef.current, {
      backgroundColor: '#ff6467',
      delay: 0.5,
    }).to(buttonRef.current, {
      backgroundImage: "linear-gradient(90deg,  #ffa2a2,#ff7e6e)",
      backgroundPosition: "70% 100%",
    })
  })
  return (
    <>
    {isLoading}
      <Button ref={buttonRef} onClick={onClick}
        className={`
        bg-[#ff7e6e] text-white
                text-center capitalize text-lg
                max-sm:text-lg
                max-lg:text-3xl max-lg:py-9
                mx-sm:text-sm max-sm:p-6
                 p-6 rounded-full hover:bg-red-400
                 cursor-pointer
                 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
        {isLoading && <Loader2 className="animate-spin mr-2" />}
        {text}
      </Button >

    </>
  )
}

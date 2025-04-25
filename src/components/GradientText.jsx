"use client"
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'

gsap.registerPlugin(useGSAP)
export default function GradientText({ txt = 'How does it work?', className }) {
  const headingRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1, defaults: {
        duration: 4, ease: 'power4.inOut',yoyo: true,yoyoEase: 'power4.inOut'
      }
    });
    tl.to(headingRef.current, {
      backgroundImage: "linear-gradient(90deg, #ff7e6e, #ffa2a2)",
      backgroundPosition: "100% 50%",
    }).to(headingRef.current, {
      backgroundColor: '#ff6467',
      delay: 0.5,
    }).to(headingRef.current, {
      backgroundImage: "linear-gradient(90deg,  #ffa2a2,#ff7e6e)",
      backgroundPosition: "70% 100%",
    })
  })

  return (
    <h2
      ref={headingRef}
      className={cn(
        `
         bg-gradient-to-r from-[#FCC6C0] to-[#FF7E6E]
         bg-clip-text text-transparent`,
        className
      )}
    >
      {txt}
    </h2>
  )
}

"use client";
import React, { useEffect, useRef } from 'react'
import { Confetti } from './magicui/confetti';

export default function Congrats({ buttonClick }) {
  const confettiRef = useRef(null);
  console.log(buttonClick)

  useEffect(() => {
    confettiRef.current?.fire({});
  }, [buttonClick])

  return (
    <>
      <div className="relative top-0 flex h-[500px] w-full flex-col items-center
      justify-center  rounded-lg border bg-background">

        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full"
        />
      </div>
    </>
  )
}

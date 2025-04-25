"use client";
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import Wave1 from '../../public/heroSection/Waves Orange (1).svg';
import Wave2 from '../../public/heroSection/Waves Orange (2).svg';
import Wave3 from '../../public/heroSection/Waves Orange (3).svg';
import Wave from '../../public/heroSection/Waves Orange.svg';

export default function SoundWaveAnimation({ className }) {
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  const wave3Ref = useRef(null)
  const wave4Ref = useRef(null)

  useEffect(() => {
    const loopAnimation = () => {
      const tl = gsap.timeline({
        repeat: -1, repeatDelay: 1
        , yoyo: true
      });

      // gsap.to([wave1Ref.current, wave2Ref.current,
      // wave3Ref.current, wave4Ref.current], {
      //   y: 1,
      //   duration: 2,
      //   ease: "sine.inOut",
      // }).to([wave1Ref.current, wave2Ref.current,
      // wave3Ref.current, wave4Ref.current], {
      //   y: 0,
      //   duration: 2,
      //   ease: "sine.inOut",
      // })

      tl
        // wave1 + wave2 fade out slowly
        .to([wave1Ref.current, wave2Ref.current], {
          opacity: 0,
          duration: 2,
          ease: "sine.inOut",
          onStart: () => {
            // Simultaneously fade in wave3 + wave4
            gsap.to([wave3Ref.current, wave4Ref.current], {
              opacity: 0.8,
              duration: 2,
              ease: "sine.inOut"
            });
          }
        })

        // wave3 + wave4 hold then fade out
        .to([wave3Ref.current, wave4Ref.current], {
          opacity: 0,
          duration: 2,
          ease: "sine.inOut",
          onStart: () => {
            // Simultaneously fade in wave1 + wave2
            gsap.to([wave1Ref.current, wave2Ref.current], {
              opacity: 1,
              duration: 2,
              ease: "sine.inOut"
            });
          }
        });
    };

    loopAnimation();
  }, []);



  return (
    <div className={cn(`relative`, className)}>
      <Image src={Wave} alt='wave' ref={wave1Ref}
        width={100} height={100}
        className='w-full py-4 z-10 top-0 relative h-full object-cover' />
      <Image src={Wave1} alt='wave' ref={wave2Ref}
        fill
        className='w-full py-4 z-10 top-0 absolute h-full object-cover' />
      <Image src={Wave2} alt='wave' ref={wave3Ref}
        fill
        className='w-full py-4 z-10 top-0 absolute h-full object-cover' />
      <Image src={Wave3} alt='wave' ref={wave4Ref}
        fill
        className='w-full py-4 z-10  top-0 absolute h-full object-cover' />
    </div>
  )
}

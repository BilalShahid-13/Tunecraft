"use client";
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import Wave1 from '../../public/heroSection/Waves Orange (1).png';
import Wave2 from '../../public/heroSection/Waves Orange (2).png';
import Wave3 from '../../public/heroSection/Waves Orange (3).png';
import Wave from '../../public/heroSection/Waves Orange.svg';

export default function SoundWaveAnimation({ className, toggleAnimation = true }) {
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  const wave3Ref = useRef(null)
  const wave4Ref = useRef(null)
  const tlRef = useRef(null);  // To store the GSAP timeline

  useEffect(() => {
    const loopAnimation = () => {
      // Create a GSAP timeline
      const tl = gsap.timeline({
        repeat: -1,  // Infinite loop
        repeatDelay: 1,
        yoyo: true,  // To create the back and forth effect
      });

      // Fade out wave1 and wave2, then fade in wave3 and wave4
      tl
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
        // Fade out wave3 + wave4, then fade in wave1 and wave2
        .to([wave3Ref.current, wave4Ref.current], {
          opacity: 0,
          duration: 2,
          ease: "sine.inOut",
          onStart: () => {
            gsap.to([wave1Ref.current, wave2Ref.current], {
              opacity: 1,
              duration: 2,
              ease: "sine.inOut"
            });
          }
        });

      // Store the timeline reference in the ref
      tlRef.current = tl;
    };

    // Initialize the animation
    loopAnimation();

    // Manage the play/pause based on toggleAnimation state
    if (toggleAnimation) {
      tlRef.current.play(); // Play the animation
    } else {
      tlRef.current.pause(); // Pause the animation
    }

    // Clean up the timeline when the component unmounts
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [toggleAnimation]);


  return (
    <>
      <div className={cn(`relative`, className)}>
        <Image src={Wave} alt='wave' ref={wave1Ref}
          width={100} height={100}
          quality={20}
          className='w-full py-4 z-10 top-0 relative h-full object-cover' />
        <Image src={Wave1} alt='wave' ref={wave2Ref}
          fill
          quality={20}
          className='w-full py-4 z-10 top-0 absolute h-full object-cover' />
        <Image src={Wave2} alt='wave' ref={wave3Ref}
          fill
          quality={20}
          className='w-full py-4 z-10 top-0 absolute h-full object-cover' />
        <Image src={Wave3} alt='wave' ref={wave4Ref}
          fill
          quality={20}
          className='w-full py-4 z-10  top-0 absolute h-full object-cover' />
      </div>
    </>
  )
}

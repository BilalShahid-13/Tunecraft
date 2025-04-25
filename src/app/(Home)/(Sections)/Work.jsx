"use client";
import BorderButton from "@/components/BorderButton";
import GradientText from "@/components/GradientText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import MusicSrc from '../../../../public/image 10.png';
import MusicSrc2 from '../../../../public/image 9.png';
import MusicSrc3 from '../../../../public/image 9 (1).png';
import Music from '../../../../public/music.png';

gsap.registerPlugin(useGSAP)

const CardItems = [
  {
    title: "You leave a request",
    description: "Describe who the song is for, its style and mood",
    image: MusicSrc,
    linearGradient: "180deg,#d04c62,#ff6467",
  },
  {
    title: 'We are creating a song',
    description: "Our composers and create unique melody and lyrics",
    image: MusicSrc2,
    linearGradient: "180deg,#d27461,#ce4d62",
  },
  {
    title: 'You get the track',
    description: "The finished song in professional quality download and enjoy!",
    image: MusicSrc3,
    linearGradient: "180deg,#ce4d62,#d27461",
  },
]

const MusicImage = ({ cn }) => {
  return (
    <div className={`absolute ${cn}`}>
      <Image
        src={Music}
        alt="ellipse"
        fill
        priority
        className="object-cover" // or object-cover, depending on your need
      />
    </div>
  )
}

export default function Work() {
  const buttonRef = useRef()
  const bloomRef = useRef()
  const titleRef = useRef()
  const desRef = useRef()
  const imgRef = useRef()
  const [current, setCurrent] = useState(0);


  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1, // loops forever
      defaults: {
        duration: 3,
        yoyo: true,
        ease: "power2.inOut",
      },
    });
    // const tl2 = gsap.timeline({
    //   repeat: -1,
    //   defaults: {
    //     duration: 2,
    //     ease: "power2.inOut",
    //   },
    // });
    // tl2.fromTo(bloomRef.current, {
    //   scale: 0,
    // }, {
    //   scale: 1,
    //   opacity: 0.8,
    //   background: 'linear-gradient(0deg,#ff6467,#ff6467)',
    //   duration: 0.4,
    //   ease: "power2.inOut",
    //   onComplete: () => {
    //     gsap.fromTo(titleRef.current, {
    //       opacity: 0
    //     }, {
    //       opacity: 1,
    //       textContent: CardItems[0].title,
    //       duration: 0.4,
    //       ease: "power2.inOut",
    //     });
    //   }
    // }).fromTo()

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


  useEffect(() => {
    const interval = setInterval(() => {
      const next = (current + 1) % CardItems.length;

      // Fade out content
      gsap.to([titleRef.current, desRef.current, imgRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => {
          setCurrent(next); // Change content

          // Animate bloomRef: scale down, change background, scale up
          gsap.timeline()
            .to(bloomRef.current, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                // Update gradient after scale-down
                bloomRef.current.style.background = `linear-gradient(${CardItems[next].linearGradient})`;
              }
            })
            .to(bloomRef.current, {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            });

          // Fade in new content
          gsap.fromTo(
            [titleRef.current, desRef.current, imgRef.current],
            { opacity: 0 },
            { opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.inOut" }
          );
        }
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [current]);



  return (
    <div className='relative flex items-center justify-center flex-col gap-12 max-sm:mt-12'>
      <GradientText txt={'How does it work?'}
        className={'uppercase text-7xl text-center max-sm:text-2xl max-md:text-5xl w-full font-medium max-lg:text-6xl'} />
      {/* rgb(66, 16, 10) */}

      <Card
        className={`relative w-[20%] max-sm:w-[60%] max-md:w-[60%]
          max-lg:w-[60%] max-xl:w-[60%]
          justify-center items-center -rotate-2 bg-black`}
        style={{
          boxShadow: `
          -5px 0 30px -5px rgb(66, 16, 10),  /* Left shadow */
          0 -2px 30px -5px rgb(66, 16, 10),  /* Top shadow */
          0 20px 30px -10px rgb(66, 16, 10)    /* Bottom shadow */
        `
        }}>
        <CardHeader
          className={'w-full text-center max-xl:text-2xl'}>
          <CardTitle ref={titleRef}
            className={'font-medium'}>
            {CardItems[current].title}</CardTitle>
          <CardDescription ref={desRef}
            className={'font-normal text-white max-xl:text-lg'}>
            {CardItems[current].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative  h-28 w-28 rounded ">
            <Image
              ref={imgRef}
              src={CardItems[current].image}
              alt="ellipse"
              fill
              priority
              className="object-cover"
            />
          </div>

        </CardContent>

      </Card>
      {/* bg bloom */}
      <div ref={bloomRef}
        //   bg-linear-to-r from-red-300 to-red-300 bg-red-300
        className="w-[500px] h-[150px] blur-3xl max-sm:w-[250px] max-sm:h-[100px]
      rounded-full absolute -z-10"></div>

      <MusicImage cn={'top-0 -z-10 w-6 h-6 ml-[50%] mt-5'} />
      <MusicImage cn={'top-0 -z-10 w-6 h-6 right-[9%] top-[20vh]'} />
      <MusicImage cn={'top-0 -z-10 w-6 h-6 left-[13%] top-[20vh] max-md:left-[1%] max-sm:top-[12%]'} />
      <MusicImage cn={'top-0 -z-10 w-6 h-6 right-[20%] top-[40vh] max-md:right-[10%] max-md:top-[55vh]'} />
      <MusicImage cn={'top-0 -z-10 w-6 h-6 left-[20%] top-[40vh] max-md:top-[55vh] max-md:left-[10%]'} />

      <BorderButton />

    </div>
  )
}

"use client";
import React, { useState, useRef, lazy } from 'react';
import GradientText from '@/components/GradientText';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { MelodiesItem } from '@/lib/Constant';
import { Pause, Play } from 'lucide-react';
import Eclipse from '../../../../public/heroSection/Ellipse 26.png';
import Star from '../../../../public/Star 9.png';

const SoundWaveAnimation = React.lazy(() =>
  import("@/components/SoundWaveAnimation")
);
// const Eclipse = lazy(()=> import ('../../../../public/heroSection/Ellipse 26.png'))

// MelodiesCard Component
const MelodiesCard = ({ heading, genre, musicSrc, isPlaying, onPlayPause, audioRef }) => {
  return (
    <Card className="relative border-[1px] border-[#DA4245] bg-black w-[620px] max-sm:w-full h-fit overflow-hidden">
      <CardHeader className="flex flex-col items-start justify-start w-full">
        <CardTitle className="text-2xl max-sm:text-lg font-normal capitalize">
          {heading}
        </CardTitle>
        <CardDescription>Genre: {genre}</CardDescription>
      </CardHeader>

      <div className="absolute top-0 right-0 w-[150px] h-[150px] ">
        <Image src={Eclipse} alt="ellipse" fill className="object-cover"
          loading="lazy"
          quality={20} />
      </div>

      <audio ref={audioRef}>
        <source src={musicSrc} type="audio/mp3" preload="metadata" />
        Your browser does not support the audio element.
      </audio>

      <CardContent className={'flex flex-row items-start justify-start ml-3'}>
        {isPlaying ? (
          <Pause
            className="scale-[2] bg-[#da4245] rounded-full p-2 z-10 relative cursor-pointer"
            onClick={onPlayPause}
          />
        ) : (
          <Play
            className="scale-[2] bg-[#da4245] rounded-full p-2 z-10 relative cursor-pointer"
            onClick={onPlayPause}
          />
        )}

        <SoundWaveAnimation className={'left-0 ml-10 z-0 -mt-[5%] w-[70%] overflow-hidden absolute bg-transparent'} />
      </CardContent>
    </Card>
  );
};


// Melodies Component (Parent)
export default function Melodies() {
  // Handle play/pause logic
  const audioRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null); // track index of playing card


  const handlePlayPause = (index) => {
    const currentAudio = audioRefs.current[index];

    if (!currentAudio) return;

    // Pause other audios
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
      }
    });

    if (currentAudio.paused) {
      currentAudio.play();
      setPlayingIndex(index);
    } else {
      currentAudio.pause();
      setPlayingIndex(null);
    }
  };

  return (
    <div className="relative flex flex-row items-start justify-start font-poppins mx-4 gap-x-[1%] max-sm:grid max-sm:grid-cols-1 max-sm:gap-14 max-md:flex max-md:flex-col max-md:gap-12 max-xl:gap-12 max-xl:flex max-xl:flex-col max-xl:justify-center max-xl:items-center max-lg:flex-col max-lg:justify-center max-lg:items-center max-lg:gap-12 max-md:justify-center max-md:items-center">
      <div className='w-[90%] max-sm:w-full flex flex-col items-start justify-start gap-12 max-sm:justify-center max-sm:gap-4 max-md:justify-center max-md:items-center max-xl:justify-center max-xl:items-center max-sm:items-center max-sm:text-center max-md:w-full'>
        <GradientText txt="Melodies that" className="heading-1 uppercase" />
        <GradientText txt="speak for you" className="relative uppercase max-md:text-6xl text-7xl max-sm:text-4xl font-semibold text-center" />
      </div>

      <div className='flex flex-col w-[60%] max-sm:w-full max-lg:w-full max-md:w-full max-md:justify-center max-md:items-center items-start justify-start gap-12 max-sm:gap-18'>
        {MelodiesItem.map((item, index) => (
          <MelodiesCard
            key={index}
            heading={item.heading}
            musicSrc={item.music}
            genre={item.genre}
            isPlaying={playingIndex === index}
            onPlayPause={() => handlePlayPause(index)}
            audioRef={(el) => (audioRefs.current[index] = el)}
          />
        ))}
      </div>

      <Image src={Star} alt="ellipse" loading="lazy"
        className="w-[40px] h-[40px] max-sm:w-[18px] max-sm:h-[18px] absolute ml-[14.5%] max-sm:ml-[37%] max-md:top-[0.5vh] max-md:-ml-[18%] max-sm:mt-[2.5%] mt-[1%] rotate-[35deg]"
        width={50} height={50} quality={20} />
      <Image src={Star} alt="ellipse" loading="lazy"
        className="w-[40px] h-[40px] max-sm:ml-[48%] absolute ml-[20.3%] max-sm:mt-[16%] max-sm:w-[18px] max-sm:h-[18px] max-md:top-[9.4vh] max-md:ml-[10%] mt-[9.6%] rotate-[35deg]"
        width={50} height={50} quality={20} />
    </div>
  );
}

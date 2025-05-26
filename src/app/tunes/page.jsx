"use client";
import GradientText from '@/components/GradientText';
import SongCard from '@/components/SongCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import { tuneAudioItems } from '@/lib/Constant';
import { useRef, useState } from 'react';
import Footer from '../(Footer)/Footer';

export default function Page() {
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef([]);

  const handlePlayPause = (index) => {
    const currentAudio = audioRef.current[index];
    if (!currentAudio) return;

    if (currentAudio.paused) {
      // Pause other audios
      if (currentSong !== null && currentSong !== index) {
        const prevAudio = audioRef.current[currentSong];
        if (prevAudio) prevAudio.pause();
      }
      currentAudio.play();
      setCurrentSong(index);
    } else {
      currentAudio.pause();
      setCurrentSong(null);
    }
  };

  return (
    <>
      <div className="w-full justify-center items-center flex flex-col gap-4">
        <GradientText txt="Tunes Collection" className={'heading-1 uppercase w-[90%] mt-2'} />
        <p className="font-inter text-xl italic w-1/2
        max-sm:w-full max-sm:text-lg max-xs:text-sm max-sm:px-4">
          Discover our collection of original tunes. Whether you're looking for pop hits,
          romantic melodies, or summer jams, we've got you covered.
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 mx-3
        gap-x-12 gap-y-32 max-sm:grid-cols-1 max-sm:gap-16
        max-lg:mx-8 max-xl:mx-8 max-sm:w-full
         max-lg:grid-cols-1 mt-12">
          {tuneAudioItems.map((items, parentIndex) => (
            <SubscriptionCard
              gradientColor={items.gradientColor}
              heading={items.model}
              key={parentIndex}
            >
              {items.tunes.map((tune, childIndex) => {
                const uniqueIndex = parentIndex * 100 + childIndex;
                return (
                  <SongCard
                    key={uniqueIndex}
                    index={uniqueIndex}
                    tune={tune}
                    currentSong={currentSong}
                    audioRef={audioRef}
                    handlePlayPause={handlePlayPause}
                  />
                );
              })}
            </SubscriptionCard>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

"use client";

import { Button } from '@/components/ui/button';
import SoundWaveAnimation from './SoundWaveAnimation';
import { Pause, Play } from 'lucide-react';

function SongCard({ index, tune, currentSong, audioRef, handlePlayPause }) {
  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md shadow-zinc-950 flex flex-col gap-3">
      <div className='flex flex-row justify-between items-center'>
        <h2 className="text-2xl font-semibold max-sm:text-lg max-xs:text-sm">{tune.name}</h2>
        <p className='max-sm:text-sm max-xs:text-sm'>{tune.songTemplate}</p>
      </div>

      <audio
        ref={(el) => (audioRef.current[index] = el)}
        src={tune.musicLink}
        preload="auto"
      />

      <div className='flex flex-row justify-start items-center mx-4 max-sm:mx-auto'>
        <Button
          onClick={() => handlePlayPause(index)}
          size="icon"
          className={'bg-[#da4245] rounded-full text-white scale-150 max-sm:scale-130 max-xs:scale-120 hover:bg-red-500 cursor-pointer'}
        >
          {currentSong === index ?
            <Pause /> : <Play />
          }
        </Button>
        <SoundWaveAnimation toggleAnimation={currentSong === index}
          className={'scale-90'} />
      </div>
    </div>
  );
}

export default SongCard;

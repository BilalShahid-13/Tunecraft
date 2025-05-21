"use client";
import { Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { useCountdown } from '@/hooks/useCountdown';
export default function TaskCard({ title = 'Birthday Song',
  des, dueDate = '12/12/2023', requirements, client = 'atif', timeAgo }) {
  const countdown = useCountdown(dueDate, 3);
  return (
    <>
      <div className='bg-[#111111] flex flex-col gap-12 p-4 rounded-lg'>
        <div className='flex flex-col gap-2'>
          <h1 className="text-2xl font-bold font-inter">{title}</h1>
          {/* days remaining */}
          <div className='flex flex-row gap-12 font-inter text-sm justify-start items-center'>
            <Badge className='bg-[#4d2c28] text-zinc-300 flex flex-row gap-2'>
              <Clock size={30} />{countdown} remaming</Badge>
            <ul className='flex flex-row gap-12 font-inter text-sm justify-center items-center'>
              <li className='text-zinc-400 list-disc'>Due: {timeAgo}</li>
              <li className='text-zinc-400 list-disc capitalize'>Client: {client}</li>
            </ul>
          </div>
        </div>
        {/* des */}
        <div className='font-inter flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-zinc-300'>Description</h1>
          <p className='text-zinc-400'>{des}</p>
        </div>

        {/* requirement */}
        <div className='font-inter flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-zinc-300'>Requirements</h1>
          <p className='text-zinc-400'>{requirements}</p>
        </div>
      </div>
    </>
  )
}

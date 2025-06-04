"use client";
import { Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { Badge } from '@/components/ui/badge';
import useCrafterTask from '@/store/crafterTask';
import { defaultTime } from '@/lib/Constant';
export default function TaskCard({ title = 'Birthday Song',
  des, dueDate, requirements, client = 'atif', timeAgo }) {
  const countdown = useCountdown(dueDate, defaultTime);
  const { userStatus } = useCrafterTask()
  return (
    <>
      {/* bg-[#111111] */}
      <div className='bg-[#111111] flex flex-col gap-12 p-4
      rounded-lg max-xs:w-full max-sm:w-full'>
        <div className='flex flex-col gap-2'>
          <h1 className="text-2xl font-bold font-inter max-sm:text-xl">{title}</h1>
          {/* days remaining */}
          <div className='flex flex-row gap-12
          max-sm:flex-col max-sm:items-start max-sm:gap-3
          font-inter text-sm justify-start items-center'>
            <Badge className="bg-[#4d2c28] text-zinc-300 flex items-center gap-2">
              {userStatus === "pending" ? (
                "Pending"
              ) : (
                <>
                  <Clock size={30} />
                  {`${countdown} remaining`}
                </>
              )}
            </Badge>
            <ul className='flex flex-row gap-12 font-inter
             text-sm justify-center items-center
             max-sm:justify-start max-sm:ml-4
             max-xs:justify-center max-xs:items-center'>
              <li className='text-zinc-400 list-disc'>Due: {timeAgo}</li>
              <li className='text-zinc-400 list-disc capitalize'>Client: {client}</li>
            </ul>
          </div>
        </div>
        {/* des */}
        <div className='font-inter flex flex-col gap-4 max-w-4xl
         max-md:max-w-xl max-lg:max-w-lg max-sm:max-w-sm max-xs:max-w-xs'>
          <h1 className='text-2xl font-semibold text-zinc-300 max-xs:text-lg
          max-sm:text-xl'>Description</h1>
          <p className='text-zinc-400 max-xs:text-sm max-md:text-sm
           max-h-48 overflow-auto break-words whitespace-normal
        capitalize p-2'>{des}</p>
        </div>

        {/* requirement */}
        <div className='font-inter flex flex-col gap-4 max-w-4xl
         max-md:max-w-xl max-lg:max-w-lg max-sm:max-w-sm max-xs:max-w-xs'>
          <h1 className='text-2xl font-semibold text-zinc-300
          max-sm:text-xl max-xs:text-lg'>Requirements</h1>
          <p className='text-zinc-400 max-xs:text-sm max-md:text-sm
           max-h-48 overflow-auto break-words whitespace-normal
        capitalize p-2'>
            {requirements}
          </p>
        </div>
      </div>
    </>
  )
}

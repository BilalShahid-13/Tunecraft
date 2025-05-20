import { MagicCard } from '@/components/magicui/magic-card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatTimeHMSS, timeAgo } from '@/lib/utils'

export default function NotificationCard({ time, onClick = () => { } }) {
  return (
    <>
      <MagicCard gradientFrom='#ff6467' gradientTo='#ff7e6e'
        className='rounded-lg cursor-pointer' bgColor='bg-zinc-900'
        // onClick={onClick}
      >
        <div className="p-4 font-inter flex flex-col gap-2" onClick={onClick}>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-sm font-semibold'>Lyricist</p>
            <Badge className={'bg-blue-400 text-white text-xs'}>Pending</Badge>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <span className='text-sm text-zinc-400 font-inter'>Bilal Shahid</span>
            <div className='flex flex-col justify-between items-center gap-1'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='text-sm font-inter text-zinc-300'>{timeAgo(time)}</TooltipTrigger>
                  <TooltipContent>
                    <p>{formatTimeHMSS(time)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </MagicCard>

    </>
  )
}

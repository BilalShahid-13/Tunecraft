import { MagicCard } from '@/components/magicui/magic-card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { _userStatus, formatTimeHMSS, timeAgo } from '@/lib/utils'

export default function NotificationCard({ status = 'Crafter Registration', approvalStatus, time, username, email = '', role, crafterId, onClick = () => { } }) {
  return (
    <>
      <MagicCard gradientFrom='#ff6467' gradientTo='#ff7e6e'
        className='rounded-lg cursor-pointer' bgColor='bg-zinc-900'
      >
        <div className="p-4 font-inter flex flex-col gap-2" onClick={onClick}>
          <h3 className='font-normal font-inter text-primary'>{status}</h3>
          <div className='flex flex-row justify-between items-center '>
            <p className='text-sm font-semibold font-inter capitalize
            flex flex-row gap-3'>{role}
              <div className='text-zinc-500 font-light'>
                # <span className="italic"> {crafterId}</span>
              </div>
            </p>
            <Badge className={`${_userStatus(approvalStatus).colorClass} text-xs`}>{_userStatus(approvalStatus).label}</Badge>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-col justify-start items-start'>
              <p className='text-sm text-zinc-400 font-inter capitalize'>{username} </p>
              {email && <p className='text-sm text-zinc-400 font-inter capitalize'>{email} </p>}
            </div>
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

import { MagicCard } from '@/components/magicui/magic-card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { _userStatus, formatTimeHMSS, timeAgo } from '@/lib/utils'
import { CircleAlert, XCircle } from 'lucide-react'

export default function NotificationCard(
  { status = 'Crafter Registration', approvalStatus,
    time, username, email = '', role,
    crafterId, onClick = () => { },
    extensionGranted, penaltyCount }) {
  return (
    <>
      <MagicCard
        gradientFrom="#ff6467"
        gradientTo="#ff7e6e"
        className="rounded-lg cursor-pointer"
        bgColor="bg-zinc-900"
      >
        <div
          className="p-4 font-inter grid grid-cols-10 gap-4"
          onClick={onClick}
        >
          {/* left side — 70% */}
          <div className="col-span-5 flex flex-col gap-2">
            <h3 className="font-normal text-primary">{status}</h3>

            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold capitalize flex gap-3">
                {role}
                <span className="text-zinc-500 font-light">
                  # <span className="italic">{crafterId}</span>
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-400 capitalize">{username}</p>
            </div>
            {/* Penalties */}
            {penaltyCount && <div className="flex items-center justify-start gap-2">
              <span className="font-normal font-inter text-sm">Penalties :</span>
              <p className='text-primary font-poppins'>0{penaltyCount}</p>
            </div>}

            {/* Extension */}
            {extensionGranted && <div className="flex flex-row items-center justify-start w-full gap-2">
              <span className="font-normal text-sm">Extension:</span>
              {extensionGranted && (
                <p className='flex flex-row gap-2 justify-center items-center font-light text-zinc-300'>
                  until <span className='italic text-xs font-poppins text-zinc-200'>22/06/35</span>
                </p>
              )}
            </div>}

          </div>

          {/* right side — 30% */}
          <div className="col-span-5 flex flex-col items-end gap-4">
            <Badge className={`${_userStatus(approvalStatus).colorClass} text-xs`}>
              {_userStatus(approvalStatus).label}
            </Badge>

            <div className="w-full flex flex-col gap-2">

              <div className="flex justify-end items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-zinc-300 font-poppins">
                      {timeAgo(time)}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatTimeHMSS(time)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </MagicCard>


    </>
  )
}

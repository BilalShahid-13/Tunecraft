import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Clock, MoveRight } from 'lucide-react'

export default function TaskCard({ badge = 'New', title = 'Card Title',
  des = 'Card Description'
}) {
  return (
    <>
      <Card className={'w-[400px] font-inter'}>
        <CardHeader className={'flex flex-row justify-between items-center'}>
          <div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge className={`${badge === 'New' ? 'bg-[#0E8FD5]' : 'bg-[#4d2c28]'} text-white`}>{badge}</Badge>
        </CardHeader>
        <CardContent className={'font-light text-zinc-600 text-sm'}>
          {des}
        </CardContent>
        <CardFooter className={'flex flex-row justify-between items-center'}>
          <div className='text-zinc-400 text-sm flex items-center gap-2'>
            <Clock size={14} />
            <p className='font-inter'>15 min</p>
          </div>
          <div className={` text-sm
          flex items-center gap-2
          ${badge === 'New' ? 'text-[#0E8FD5]/70' : 'text-red-400'}`}>
            <Dialog>
              <DialogTrigger className={'cursor-pointer'}>  <p>View Details</p></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <MoveRight />
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

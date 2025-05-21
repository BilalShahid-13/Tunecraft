"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCountdown } from "@/hooks/useCountdown";
import { musicPlans } from "@/lib/Constant";
import useSidebarWidth from "@/store/sidebarWidth";
import useTasks from "@/store/tasks";
import axios from "axios";
import { Clock, Loader2, MoveRight } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "sonner";


export default function TaskCard({
  badge = 'New',
  title = 'Birthday Song',
  des = 'i want song like o repiya sung by rahet',
  plan, item, session, assignedAtTime,
  time = '3hr', bgStory, currentStage, songGenre, setGracePeriodError
}) {
  let defaultTime = 3;
  const [userPlan, setUserPlan] = useState({ title: '', price: 0 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeUpHandled, setTimeUpHandled] = useState(false)
  const { width } = useSidebarWidth();
  const { setFetchedTasks } = useTasks()
  const countdown = useCountdown(assignedAtTime, defaultTime)

  useEffect(() => {
    if (plan) {
      const musicPlan = musicPlans.find(item => item.plan === plan.name)
      if (musicPlan) {
        setUserPlan({ price: musicPlan[currentStage], title: musicPlan.plan })
      }
    }
  }, [plan])

  useEffect(() => {
    if (countdown === '0:00:00' && !timeUpHandled) {
      TimeUp();
    }
  }, [countdown, timeUpHandled])

  async function TimeUp() {
    if (countdown === '0:00:00') {
      try {
        const res = await axios.patch('/api/extend-crafter-time', {
          orderId: item._id,
          role: session.user.role,
          crafterId: session.user.id
        })
        if (res.status === 200) {
          defaultTime = 2
          setFetchedTasks(true)
          setTimeUpHandled(true)

          toast.success(res.data.message)
          console.log(res.data.message)
        }
      } catch (error) {
        console.error(error.response.data.error);
        setGracePeriodError(error.response.data.error)
      }
    }
  }


  const startWorking = async (item) => {
    setIsLoading(true)
    try {
      const res = await axios.patch('/api/startWorking', {
        orderId: item._id,
        role: session.user.role,
        userId: session.user.id
      })
      if (res.statusText === 'OK') {
        console.log('order started successfully', res)
        setFetchedTasks(true)
        setDialogOpen(false)
      }
    } catch (error) {
      console.error(error.response.data.error);
      toast.error(error.response.data.error)
      setDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className={`${width ? 'w-[440px] max-xl:w-[420px]' :
        'w-[420px] max-xl:w-[430px]'} font-inter max-xs:w-full max-sm:w-full`}>
        <CardHeader className={'flex flex-row justify-between items-center'}>
          <div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge className={`${badge === 'New' ? 'bg-[#0E8FD5]' : 'bg-[#4d2c28]'} text-white`}>{badge}</Badge>
        </CardHeader>
        <CardContent className={'font-light text-zinc-600 text-sm'}>
          {des}
        </CardContent>
        <CardFooter className={'flex flex-row  justify-between items-center'}>
          <div className='text-zinc-400 text-sm flex items-center gap-2'>
            <Clock size={14} />
            <p className='font-inter'>{badge === 'New' ? time : countdown}</p>
          </div>
          <div className='text-zinc-400 text-sm flex items-center gap-2'>
            <h2 className='font-semibold font-inter'>MX$</h2>
            <p className='font-inter'>{userPlan.price}</p>
          </div>
          <div className={` text-sm
          flex items-center gap-2
          ${badge === 'New' ? 'text-[#0E8FD5]/70' : 'text-red-400'}`}>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className={'cursor-pointer max-sm:text-xs flex justify-center items-center gap-2'}>  <p>View Details</p>
                <MoveRight className="max-sm:text-xs max-sm:scale-x-75" /></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription className={'flex flex-col gap-2'}>
                    <span className="flex flex-row gap-2 font-inter justify-between items-center w-full">
                      <span className="font-medium">{songGenre}</span>
                      <span className="flex flex-col gap-2 justify-end items-center">
                        <span className="text-primary text-sm font-semibold">{userPlan.title}</span>
                        <span><span className="font-semibold">MX$</span> {userPlan.price}</span>
                      </span>
                    </span>
                    <span className="font-semibold"> Description</span>
                    <span className="font-inter capitalize">{des}</span>
                    <span className="font-semibold"> Client Comments</span>
                    <span className="font-inter capitalize">{bgStory}</span>
                    {/* {`${index}`} */}
                  </DialogDescription>
                </DialogHeader>
                {badge === 'New' && <DialogFooter>
                  <Button className={'text-white cursor-pointer'}
                    onClick={() => startWorking(item)} disabled={isLoading}>
                    {isLoading ? <React.Fragment>
                      <Loader2 className="animate-spin" />
                      Loading
                    </React.Fragment> : 'Start Working'}
                  </Button>
                </DialogFooter>}
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

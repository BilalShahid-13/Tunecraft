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
import useCountdown from "@/hooks/useCountdown";
import { musicPlans } from "@/lib/Constant";
import { formatDateTime, formatTimeHMSS } from "@/lib/utils";
import useSidebarWidth from "@/store/sidebarWidth";
import useTabValue from "@/store/tabValue";
import useTasks from "@/store/tasks";
import axios from "axios";
import { Clock, Loader2, MoveRight } from 'lucide-react';
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ExtendTimeline from "./ExtendTimeline";

const DialogDetails = memo(({ title, songGenre, userPlan, des, bgStory, badge, startWorking, isLoading, item }) => (
  <>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription className="flex flex-col gap-4 max-w-md max-sm:max-w-sm max-xs:max-w-[18rem]">
        <span className="flex flex-row gap-2 font-inter justify-between items-center max-xs:items-start w-full">
          <span className="font-medium">{songGenre}</span>
          <span className="flex flex-col gap-2 justify-end items-center">
            <span className="text-primary text-sm font-semibold max-xs:text-xs">{userPlan.title}</span>
            <span><span className="font-semibold max-xs:text-xs">MX$</span> {userPlan.price}</span>
          </span>
        </span>

        <span className="max-xs:text-left font-semibold max-xs:text-sm">Description</span>
        <span className="max-h-48 max-xs:max-h-24 overflow-auto break-words
        max-xs:text-xs max-xs:text-left
                    whitespace-normal font-inter capitalize p-2
                    rounded-md">
          {des}
        </span>

        <span className="font-semibold max-xs:text-left">Client Comments</span>
        <span className="max-h-48 overflow-auto break-words
        w-full max-xs:text-xs max-xs:max-h-24 max-xs:text-left
        whitespace-normal font-inter capitalize p-2 rounded-md">
          {bgStory}
        </span>
      </DialogDescription>
    </DialogHeader>

    {badge === 'available' && (
      <DialogFooter>
        <Button
          className="text-white cursor-pointer"
          onClick={() => startWorking(item)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Loading
            </>
          ) : (
            'Start Working'
          )}
        </Button>
      </DialogFooter>
    )}
  </>
));


export default function TaskCard({
  badge = 'available',
  title = 'Birthday Song',
  musicTemplate,
  des = 'i want song like o repiya sung by rahet',
  plan, item, session, assignedAtTime, index, inReview,
  time = '3hr', bgStory, currentStage, songGenre
}) {
  const [userPlan, setUserPlan] = useState({ title: '', price: 0 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [timeUpHandled, setTimeUpHandled] = useState(false)
  const [activeCardHover, setActiveCardHover] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const { width } = useSidebarWidth();
  const { setFetchedTasks } = useTasks()
  const { setTabValue } = useTabValue()
  const countdown = useCountdown(assignedAtTime)

  useEffect(() => {
    if (plan) {

      let stageKey = currentStage;

      // Check if currentStage is defined before calling .includes
      if (currentStage && (currentStage.includes('review_lyricist') || currentStage.includes('review_singer') || currentStage.includes('review_engineer'))) {
        stageKey = currentStage.split('_')[1];
      }

      const musicPlan = musicPlans.find(item => item.plan === plan.name);
      if (musicPlan) {
        setUserPlan({ price: musicPlan[stageKey], title: musicPlan.plan });
      }
    }
  }, [plan, currentStage]);  // Make sure to also include currentStage as a dependency


  useEffect(() => {
    if (countdown === '0:00:00' && !timeUpHandled) {
      setTimeUp(true)
    }
  }, [countdown, timeUpHandled])

  function TaskStatus(badge) {
    switch (badge) {
      case 'available':
        return {
          text: 'text-[#0E8FD5]/70',
          bg: 'bg-[#0E8FD5]/70'
        }
      case 'active':
        return {
          text: 'text-red-400',
          bg: 'bg-red-400'
        };
      case 'review':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-400'
        };
      case 'completed':
        return {
          text: 'text-green-400',
          bg: 'bg-green-600'
        };
    }
  }

  const startWorking = async (item) => {
    setIsLoading(true)
    try {
      const res = await axios.patch('/api/startWorking', {
        orderId: item?._id,
        role: session.user.role,
        userId: session.user.id
      })
      if (res.statusText === 'OK') {
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

  const cardClick = () => {
    setAlertDialogOpen(true)
    if (timeUp && !inReview) {
      return <ExtendTimeline />
    } else {
      if (inReview || (badge === 'active' || badge === "review")) {
        setTabValue({ value: 'Tasks' })
      }
    }
  }

  return (
    <>
      {((badge === 'active' || badge === "review") && timeUp && !inReview) &&
        <ExtendTimeline orderId={item?.orderId}
          setTimeUpHandled={setTimeUpHandled}
          timeUp={timeUp}
          role={session.user.role} userId={session.user.id}
          isOpen={alertDialogOpen} onOpenChange={setAlertDialogOpen} />}
      <Card
        onClick={cardClick}
        onMouseEnter={() => {
          if (inReview || (badge === 'active' || badge === "review")) {
            setActiveCardHover(index)
          }
        }}
        onMouseLeave={() => {
          if ((inReview || badge === 'active' || badge === "review")) {
            setActiveCardHover(false)
          }
        }}
        className={`${width ?
          `
          ${badge === 'available' ? 'w-[330px] max-lg:w-[340px] max-xl:w-[420px]' :
            `w-[420px] max-xl:w-[300px] max-lg:w-[340px]`}` :
          `
          ${badge === 'available' ? 'w-[320px] max-lg:w-[380px]' :
            `w-[420px] max-lg:w-[380px] max-xl:w-[430px]`} font-inter`}
           max-xs:w-full max-sm:w-full
        ${(badge === 'active' || badge === "review") && (activeCardHover === index) ?
            'border-red-400 cursor-pointer' : ''} transition-all ease-in duration-150`}>
        <CardHeader className={'flex flex-row justify-between items-center'}>
          <CardTitle className={'flex flex-col gap-2 font-inter'}>
            <h2>{musicTemplate}</h2>
            <h6 className="text-zinc-400 text-sm font-normal italic ml-2">{title}</h6>
          </CardTitle>
          <Badge className={`${inReview ? TaskStatus('active').bg : TaskStatus(badge).bg} text-white capitalize max-xs:text-xs`}>{inReview ? 'pending' : badge}</Badge>
        </CardHeader>
        <CardContent className="font-light text-zinc-600
        text-sm max-w-lg max-xs:text-xs
         break-words whitespace-normal max-h-[10vh] min-h-[9vh]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,        // number of lines to show
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {des}
        </CardContent>
        <CardFooter className={`flex flex-row
           justify-between items-center`}>
          <div className='text-zinc-400 text-sm max-xs:text-xs flex items-center gap-2'>
            <Clock size={badge === 'completed' ? 30 : 14} />
            <p className='font-inter'>{badge === 'available' && time}</p>
            {badge === 'completed' && <div className="flex flex-col w-full justify-start items-start">
              <p className='font-inter text-sm font-normal'>{formatDateTime(assignedAtTime).date}</p>
              <p className='font-inter font-light text-xs'>{formatDateTime(assignedAtTime).time}</p>
            </div>}
            {inReview ? <p className='font-inter'>
              {(inReview && (badge === 'active' || badge === "review")) && formatTimeHMSS(assignedAtTime)}</p> :
              <p className='font-inter'>{(badge === 'active' || badge === "review") && countdown}</p>}
          </div>
          <div className='text-zinc-400 text-sm flex items-center gap-2 max-xs:text-xs'>
            <h2 className='font-semibold font-inter'>MX$</h2>
            <p className='font-inter'>{userPlan.price}</p>
          </div>
          {badge === 'available' && <div className={` text-sm
          flex items-center gap-2
          ${TaskStatus(badge).text}`}>
            <Dialog open={dialogOpen}
              onOpenChange={setDialogOpen}>
              <DialogTrigger className={'cursor-pointer max-sm:text-xs flex justify-center items-center gap-2'}>  <p>View Details</p>
                <MoveRight className="max-sm:text-xs max-sm:scale-x-75" /></DialogTrigger>
              {dialogOpen &&
                <DialogContent className="w-full
                max-sm:max-w-md max-md:max-w-lg p-4 max-xs:max-w-xs">
                  <DialogDetails
                    title={title}
                    songGenre={songGenre}
                    userPlan={userPlan}
                    des={des}
                    bgStory={bgStory}
                    badge={badge}
                    startWorking={startWorking}
                    isLoading={isLoading}
                    item={item}
                  />
                </DialogContent>}

            </Dialog>
          </div>}
        </CardFooter>
      </Card >
    </>
  )
}

"use client";
import useSidebarWidth from '@/store/sidebarWidth';
import useTasks from '@/store/tasks';
import { GetServerLoading } from '@/utils/GetServerLoading';
import axios from 'axios';
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useSession } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import useCrafterTask from '@/store/crafterTask';

function NoAvailableTasks({ msg }) {
  return (
    <p className='text-zinc-600 font-inter italic ml-zinc-600 ml-23'>No {msg} Task Yet</p>
  )
}
export default function Dashboard() {
  const { data } = useSession()
  const [session, setSession] = useState(null)
  const [activeTask, setActiveTask] = useState([]);
  const [availableTask, setAvailableTask] = useState([]);
  const { width } = useSidebarWidth();
  const [timeOutError, setTimeOutError] = useState(false)
  const { fetchedTasks, setFetchedTasks } = useTasks()
  const { setCrafterTask } = useCrafterTask()

  useEffect(() => {
    setSession(data)
  }, [data])

  useEffect(() => {
    if (session) {
      fetchAvailableTask()
      fetchActiveTask()
    }
  }, [session])

  useEffect(() => {
    if (fetchedTasks) {
      fetchAvailableTask();
      fetchActiveTask();
      setFetchedTasks(false)
    }
  }, [fetchedTasks])

  const fetchAvailableTask = async () => {
    console.log(session)
    try {
      const res = await axios.post('/api/availableTasks', {
        role: session.user.role
      })
      if (res.statusText === 'OK') {
        setAvailableTask(res.data.data)
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }
  const fetchActiveTask = async () => {
    console.log(session)
    try {
      const res = await axios.post('/api/activeTask', {
        role: session.user.role,
        userId: session.user.id
      })
      if (res.statusText === 'OK') {
        setActiveTask(res.data.data)
        setCrafterTask({
          orderId: res.data.data[0]?._id,
          title: res.data.data[0]?.musicTemplate,
          des: res.data.data[0]?.jokes,
          requirements: res.data.data[0]?.backgroundStory,
          clientName: res.data.data[0]?.name,
          dueData: res.data.data[0]?.createdAt,
        })
        console.log('active task', res.data.data[0])
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  function setGracePeriodError(error) {
    setTimeOutError(error)
    console.log('setGracePeriodError', error)
  }

  console.log(activeTask[0]?.crafters[session.user.role].assignedAtTime)

  if (!data) {
    return (
      <GetServerLoading session={data} />
    )
  }

  return (
    <>
      <div className='flex flex-col justify-start items-start gap-12 font-inter w-full'>
        <div className='flex flex-col justify-start items-start gap-3 font-inter pt-3'>
          <h2 className='text-6xl font-semibold max-sm:text-2xl'>Welcome back,
            <span className='capitalize'>
              {session?.user.username}</span>
          </h2>
          <p className='max-sm:text-sm'>Here's an overview of your tasks and projects</p>
        </div>
        <div className='space-y-4 w-fit relative max-sm:gap-3
      '>
          <h2 className='border-l-6 border-l-[#ff7e6e] rounded-xs
      text-2xl font-medium font-inter px-4 max-sm:text-lg'>Active Task</h2>
          {/* Active Task */}
          <Suspense
            fallback={<GetServerLoading session={data} />}>
            {timeOutError && (
              <Alert className="w-fit" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{timeOutError}</AlertDescription>
              </Alert>
            )}
            <div className={`grid ${width ? 'grid-cols-4 max-md:grid-cols-2 max-lg:grid-cols-2 max-xl:grid-cols-3' :
              'grid-cols-3 max-lg:grid-cols-1 max-md:grid-cols-1 max-xl:grid-cols-2'}
              gap-4 max-sm:grid-cols-1 max-xs:grid-cols-1`}>
              {(!activeTask || activeTask.length === 0) ? (
                <NoAvailableTasks msg={"Active"} />
              ) : <>
                {activeTask.map((item, index) => (
                  <TaskCard
                    key={index}
                    badge="active"
                    session={session}
                    index={index}
                    assignedAtTime={item.crafters[session.user.role].assignedAtTime}
                    title={item.musicTemplate}
                    des={item.jokes}
                    plan={item.plan}
                    songGenre={item.songGenre}
                    item={item}
                    setGracePeriodError={setGracePeriodError}
                    bgStory={item.backgroundStory}
                    currentStage={item.currentStage}
                  />
                ))}
              </>
              }

            </div>
          </Suspense>
        </div>
        {/* available task */}
        <div
          className='space-y-4 w-full relative max-sm:gap-3 overflow-x-hidden'
        >
          <h2 className='border-l-6 border-l-[#0e8fd5] rounded-xs
text-2xl font-medium font-inter px-4 max-sm:text-lg'>Available Task</h2>
          <Suspense
            fallback={<GetServerLoading session={data} />}>
            <div className={`grid ${width ? 'grid-cols-4 max-md:grid-cols-2 max-lg:grid-cols-2 max-xl:grid-cols-3' :
              'grid-cols-3 max-lg:grid-cols-1 max-md:grid-cols-1 max-xl:grid-cols-2'}
              gap-4 max-sm:grid-cols-1 max-xs:grid-cols-1`}>
              {(!availableTask || availableTask.length === 0) ?
                <NoAvailableTasks msg={"Available"} /> :
                availableTask.map((item, index) => (
                  <TaskCard
                    key={index}
                    session={session}
                    index={index}
                    title={item.musicTemplate}
                    des={item.jokes}
                    plan={item.plan}
                    songGenre={item.songGenre}
                    item={item}
                    bgStory={item.backgroundStory}
                    currentStage={item.currentStage} />
                ))}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  )
}

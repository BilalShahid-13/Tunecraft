"use client";
import useCrafterTask from '@/store/crafterTask';
import useSidebarWidth from '@/store/sidebarWidth';
import useTasks from '@/store/tasks';
import { GetServerLoading } from '@/utils/GetServerLoading';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import TaskLayoutRoot from './TaskLayoutRoot';

export default function Dashboard() {
  const { data } = useSession()
  const [session, setSession] = useState(null)
  const [activeTask, setActiveTask] = useState([]);
  const [availableTask, setAvailableTask] = useState([]);
  const [pendingTask, setPendingTask] = useState([])
  const [completedTask, setCompletedTask] = useState([]);
  const { width } = useSidebarWidth();
  const [timeOutError, setTimeOutError] = useState(false)
  const { fetchedTasks, setFetchedTasks } = useTasks()
  const { setCrafterTask, crafterTask } = useCrafterTask()

  useEffect(() => {
    setSession(data)
  }, [data])

  useEffect(() => {
    if (session) {
      fetchAvailableTask();
      fetchActiveTask();
      fetchPendingTask();
      fetchCompletedTask();
    }
  }, [session])

  useEffect(() => {
    if (fetchedTasks) {
      fetchAvailableTask();
      fetchActiveTask();
      fetchPendingTask();
      fetchCompletedTask();
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
    try {
      const res = await axios.post('/api/activeTask', {
        role: session.user.role,
        userId: session.user.id,
      });

      if (res.statusText === 'OK') {
        const role = session.user.role;
        const tasks = res.data.data;

        setActiveTask(tasks);

        // Check if tasks is an array and has at least one item
        if (Array.isArray(tasks) && tasks.length > 0) {
          const data = tasks[0];

          // Defensive check for required properties
          if (data && data._id && data.crafters && data.crafters[role]) {
            setCrafterTask({
              orderId: data._id,
              title: data.musicTemplate,
              des: data.jokes,
              requirements: data.backgroundStory,
              clientName: data.name,
              dueData: data.crafters[role].assignedAtTime,
            });
          }
        }
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };


  const fetchPendingTask = async () => {
    try {
      const res = await axios.post('/api/pending-tasks', {
        userId: session.user.id,
        role: session.user.role
      })
      if (res.status === 200) {
        console.log('allPending', res.data.data)
        setPendingTask(res.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCompletedTask = async () => {
    try {
      const res = await axios.post('/api/complete-task', {
        userId: session.user.id,
        role: session.user.role
      })
      if (res.status === 200) {
        console.log('allCompleted', res.data.data)
        setCompletedTask(res.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setGracePeriodError(error) {
    setTimeOutError(error)
    console.log('setGracePeriodError', error)
  }

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
        <div className='flex flex-col gap-12 '>
          {/* activeTask */}
          <TaskLayoutRoot taskName='active'
            inReview={activeTask.length > 0 ? false : true}
            tasks={activeTask.length > 0 ? activeTask : pendingTask}
            // tasks={activeTask}
            session={session} />
          <TaskLayoutRoot
            taskName='available'
            tasks={availableTask}
            session={session} />
          {/* completed */}
          <TaskLayoutRoot
            taskName='completed'
            tasks={completedTask}
            session={session} />
        </div>
      </div>
    </>
  )
}

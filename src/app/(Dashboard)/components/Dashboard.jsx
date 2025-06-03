"use client";
import fetchActiveTask from '@/components/serverComponents/fetchActiveTask';
import fetchCompleteTask from '@/components/serverComponents/fetchCompleteTask';
import fetchCrafterAvailableTask from '@/components/serverComponents/fetchCrafterAvailableTask';
import fetchPendingTask from '@/components/serverComponents/fetchPendingTask';
import useCrafterTask from '@/store/crafterTask';
import useTasks from '@/store/tasks';
import { GetServerLoading } from '@/utils/GetServerLoading';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import TaskLayoutRoot from './TaskLayoutRoot';

// Custom hook to fetch tasks based on type
const useFetchTasks =
  (session, fetchedTasks,
    setFetchedTasks,
    setIsLoadingAvailableTask,
    setIsLoadingActiveTask,
    setIsCompletedTask) => {
    const [activeTask, setActiveTask] = useState([]);
    const [availableTask, setAvailableTask] = useState([]);
    const [pendingTask, setPendingTask] = useState([]);
    const [completedTask, setCompletedTask] = useState([]);
    const setCrafterTask = useCrafterTask((state) => state.setCrafterTask);
    const crafterTask = useCrafterTask((state) => state.crafterTask);

    const fetchAvailableTask = useCallback(async () => {
      try {
        setIsLoadingAvailableTask(true)
        const availableData = await fetchCrafterAvailableTask(fetchedTasks)
        setAvailableTask(availableData);
      } catch (error) {
        console.error('Error fetching available tasks:', error?.response?.data || error.message);
      } finally {
        setIsLoadingAvailableTask(false)
      }
    }, [session]);

    const getActiveTask = useCallback(async () => {
      setIsLoadingActiveTask(true)
      try {
        const { activeTask, crafterTask } = await fetchActiveTask(fetchedTasks)
        setActiveTask(activeTask)
        setCrafterTask(crafterTask)

      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoadingActiveTask(false);
      }
    }, [session]);

    const getPendingTask = useCallback(async () => {
      if (!session) return;
      try {
        const { pendingTask, crafterTask } = await fetchPendingTask(fetchedTasks);
        setPendingTask(pendingTask);
        setCrafterTask(crafterTask);
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
      }
    }, [session]);

    const getCompletedTask = useCallback(async () => {
      if (!session) return;
      setIsCompletedTask(true)
      try {
        const { completeTask } = await fetchCompleteTask(fetchedTasks);
        setCompletedTask(completeTask);

      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setIsCompletedTask(false)
      }
    }, [session]);

    useEffect(() => {
      if (session) {
        fetchAvailableTask();
        getActiveTask();
        getPendingTask();
        getCompletedTask();
      }
    }, [session, fetchAvailableTask, getActiveTask, getPendingTask, getCompletedTask]);

    useEffect(() => {
      if (fetchedTasks) {
        fetchAvailableTask();
        getActiveTask();
        getPendingTask();
        getCompletedTask();
        setFetchedTasks(false);
      }
    }, [fetchedTasks, fetchAvailableTask, getActiveTask, getPendingTask, getCompletedTask]);

    return {
      activeTask,
      availableTask,
      pendingTask,
      completedTask,
    };
  };


export default function Dashboard() {
  const { data: sessionData, status } = useSession();
  const [session, setSession] = useState(null);
  const [isLoadingAvailableTask, setIsLoadingAvailableTask] = useState();
  const [isLoadingActiveTask, setIsLoadingActiveTask] = useState();
  const [isLoadingCompletedTask, setIsCompletedTask] = useState();
  const { fetchedTasks, setFetchedTasks } = useTasks();
  // Sync session data
  useEffect(() => {
    if (status === 'authenticated') {
      setSession(sessionData);
    }
  }, [sessionData, status]);

  // Use custom hook to fetch tasks
  const { activeTask, availableTask, pendingTask, completedTask } = useFetchTasks(session, fetchedTasks, setFetchedTasks, setIsLoadingAvailableTask, setIsLoadingActiveTask, setIsCompletedTask);


  if (status === 'loading') {
    return <GetServerLoading session={sessionData} />;
  }

  if (!session) {
    return <GetServerLoading session={sessionData} />;
  }

  return (
    <div className="flex flex-col justify-start items-start gap-12 font-inter w-full">
      <div className="flex flex-col justify-start items-start gap-3 font-inter pt-3">
        <h2 className="text-6xl font-semibold max-sm:text-2xl">
          Welcome back, <span className="capitalize">{session.user.username}</span>
        </h2>
        <p className="max-sm:text-sm">Here's an overview of your tasks and projects</p>
      </div>
      <div className="flex flex-col gap-12">
        <TaskLayoutRoot
          taskName="active"
          inReview={activeTask.length === 0}
          tasks={activeTask.length > 0 ? activeTask : pendingTask}
          session={session}
          isLoading={isLoadingActiveTask}
        />
        <TaskLayoutRoot taskName="available" tasks={availableTask} session={session} isLoading={isLoadingAvailableTask} />
        <TaskLayoutRoot taskName="completed" tasks={completedTask} session={session} isLoading={isLoadingCompletedTask} />
      </div>
    </div>
  );
}

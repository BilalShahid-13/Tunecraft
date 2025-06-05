"use client";

import fetchActiveTask from '@/components/serverComponents/fetchActiveTask';
import fetchCompleteTask from '@/components/serverComponents/fetchCompleteTask';
import fetchCrafterAvailableTask from '@/components/serverComponents/fetchCrafterAvailableTask';
import fetchPendingTask from '@/components/serverComponents/fetchPendingTask';
import useCrafterTask from '@/store/crafterTask';
import useTasks from '@/store/tasks';
import { GetServerLoading } from '@/utils/GetServerLoading';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import TaskLayoutRoot from './TaskLayoutRoot';
import ActiveTaskCard from './ActiveTaskCard';
import Plenties from './Plenties';

const useFetchTasks = (
  session,
  fetchedTasks,
  setFetchedTasks,
  setIsLoadingAvailableTask,
  setIsLoadingActiveTask,
  setIsCompletedTask
) => {
  const [activeTask, setActiveTask] = useState([]);
  const [availableTask, setAvailableTask] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const setCrafterTask = useCrafterTask((state) => state.setCrafterTask);

  useEffect(() => {
    if (!session) return;

    const fetchAvailableTask = async () => {
      try {
        setIsLoadingAvailableTask(true);
        const availableData = await fetchCrafterAvailableTask(fetchedTasks);
        setAvailableTask(availableData);

      } catch (error) {
        console.error('Error fetching available tasks:', error?.response?.data || error.message);
      } finally {
        setIsLoadingAvailableTask(false);
      }
    };

    const getActiveTask = async () => {
      setIsLoadingActiveTask(true);
      try {
        const { crafterTask } = await fetchActiveTask(fetchedTasks);
        setActiveTask(crafterTask); // activeTask is always an array
        setCrafterTask(crafterTask); // crafterTask is object or null
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingActiveTask(false);
      }
    };

    const getPendingTask = async () => {
      try {
        const { pendingTask: tasksArray, crafterTask: taskData } = await fetchPendingTask(fetchedTasks);

        if (Array.isArray(tasksArray) && tasksArray.length > 0) {
          setPendingTask(tasksArray);
        } else {
          setPendingTask([]); // clear if none
        }

        if (taskData) {
          setCrafterTask(taskData);
        }
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
      }
    };

    const getCompletedTask = async () => {
      setIsCompletedTask(true);
      try {
        const { completeTask } = await fetchCompleteTask(fetchedTasks);
        setCompletedTask(completeTask);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setIsCompletedTask(false);
      }
    };

    fetchAvailableTask();
    getActiveTask();
    getPendingTask();
    getCompletedTask();
  }, [session, fetchedTasks, setFetchedTasks, setIsLoadingAvailableTask, setIsLoadingActiveTask, setIsCompletedTask, setCrafterTask]);

  useEffect(() => {
    if (fetchedTasks) {
      const fetchAllTasks = async () => {
        try {
          setIsLoadingAvailableTask(true);
          setIsLoadingActiveTask(true);
          setIsCompletedTask(true);

          const availableData = await fetchCrafterAvailableTask(fetchedTasks);
          setAvailableTask(availableData);

          const { activeTask, crafterTask } = await fetchActiveTask(fetchedTasks);
          setActiveTask([crafterTask]);
          setCrafterTask(crafterTask);

          const { pendingTask: tasksArray, crafterTask: taskData } = await fetchPendingTask(fetchedTasks);
          if (Array.isArray(tasksArray) && tasksArray.length > 0) {
            setPendingTask(tasksArray);
          } else {
            setPendingTask([]);
          }
          if (taskData) {
            setCrafterTask(taskData);
          }

          const { completeTask } = await fetchCompleteTask(fetchedTasks);
          setCompletedTask(completeTask);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsLoadingAvailableTask(false);
          setIsLoadingActiveTask(false);
          setIsCompletedTask(false);
          setFetchedTasks(false);
        }
      };

      fetchAllTasks();
    }
  }, [fetchedTasks, setFetchedTasks, setIsLoadingAvailableTask, setIsLoadingActiveTask, setIsCompletedTask, setCrafterTask]);

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
  const [isLoadingAvailableTask, setIsLoadingAvailableTask] = useState(false);
  const [isLoadingActiveTask, setIsLoadingActiveTask] = useState(false);
  const [isLoadingCompletedTask, setIsCompletedTask] = useState(false);
  const { fetchedTasks, setFetchedTasks } = useTasks();

  // Sync session data
  useEffect(() => {
    if (status === 'authenticated') {
      setSession(sessionData);
    }
  }, [sessionData, status]);

  // Use custom hook to fetch tasks
  const { activeTask, availableTask, pendingTask, completedTask } = useFetchTasks(
    session,
    fetchedTasks,
    setFetchedTasks,
    setIsLoadingAvailableTask,
    setIsLoadingActiveTask,
    setIsCompletedTask
  );

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
        <Plenties />
      </div>
      <div className="flex flex-col gap-12">
        <ActiveTaskCard
          taskName="active"
          inReview={pendingTask.length > 0}
          tasks={pendingTask.length > 0 ? pendingTask : activeTask}
          session={session}
          isLoading={isLoadingActiveTask}
        />
        <TaskLayoutRoot taskName="available" tasks={availableTask} session={session} isLoading={isLoadingAvailableTask} />
        <TaskLayoutRoot taskName="completed" tasks={completedTask} session={session} isLoading={isLoadingCompletedTask} />
      </div>
    </div>
  );
}

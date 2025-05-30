"use client";
import useCrafterTask from '@/store/crafterTask';
import { GetServerLoading } from '@/utils/GetServerLoading';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import TaskLayoutRoot from './TaskLayoutRoot';
import useTasks from '@/store/tasks';
import { prevRole } from '@/lib/utils';

// Custom hook to fetch tasks based on type
const useFetchTasks = (session, fetchedTasks, setFetchedTasks, setIsLoadingAvailableTask, setIsLoadingActiveTask, setIsCompletedTask) => {
  const [activeTask, setActiveTask] = useState([]);
  const [availableTask, setAvailableTask] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const setCrafterTask = useCrafterTask((state) => state.setCrafterTask);
  const crafterTask = useCrafterTask((state) => state.crafterTask);

  const fetchAvailableTask = useCallback(async () => {
    if (!session) return;
    setIsLoadingAvailableTask(true)
    try {
      const res = await axios.post('/api/availableTasks', {
        role: session.user.role,
        userId: session.user.id
      });
      if (res.status === 200) {
        setAvailableTask(res.data.data);
        console.log('availableTask', res.data)
      }
    } catch (error) {
      console.error('Error fetching available tasks:', error?.response?.data || error.message);
    } finally {
      setIsLoadingAvailableTask(false)
    }
  }, [session]);

  const fetchActiveTask = useCallback(async () => {
    if (!session) return;
    setIsLoadingActiveTask(true)
    try {
      const res = await axios.post('/api/activeTask', {
        role: session.user.role,
        userId: session.user.id,
      });
      if (res.status === 200) {
        const tasks = res.data.data;
        if (Array.isArray(tasks) && tasks.length > 0) {
          setActiveTask(tasks)
          console.log('tasks', tasks)
          const data = tasks[0]
          const newTaskData = {
            orderId: data?._id,
            title: data.musicTemplate,
            des: data.jokes,
            requirements: data.backgroundStory,
            clientName: data.name,
            dueData: data.crafters[session.user.role]?.assignedAtTime || "",
            submittedFileUrls: data.crafters[prevRole(session.user.role)]?.submittedFileUrl
          }
          setCrafterTask(newTaskData) // Pass the actual data object
        }
      }
    } catch (error) {
      console.error('Error fetching active tasks:', error?.response?.data || error.message);
    }
    finally {
      setIsLoadingActiveTask(false);
    }
  }, [session]);

  const fetchPendingTask = useCallback(async () => {
    if (!session) return;
    try {
      const res = await axios.post('/api/pending-tasks', {
        userId: session.user.id,
        role: session.user.role,
      });
      if (res.status === 200) {
        const tasks = res.data.data;
        console.log('tasks',tasks)
        setPendingTask(res.data.data);
        const data = tasks[0]
        const newTaskData = {
          orderId: data._id,
          title: data.musicTemplate,
          des: data.jokes,
          requirements: data.backgroundStory,
          clientName: data.name,
          dueData: data.crafters[session.user.role]?.assignedAtTime || "",
          submittedFileUrls: data.crafters[prevRole(session.user.role)]?.submittedFile
        }
        setCrafterTask(newTaskData,'pending')
      }
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
    }
  }, [session]);

  const fetchCompletedTask = useCallback(async () => {
    if (!session) return;
    setIsCompletedTask(true)
    try {
      const res = await axios.post('/api/complete-task', {
        userId: session.user.id,
        role: session.user.role,
      });
      if (res.status === 200) {
        setCompletedTask(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setIsCompletedTask(false)
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchAvailableTask();
      fetchActiveTask();
      fetchPendingTask();
      fetchCompletedTask();
    }
  }, [session, fetchAvailableTask, fetchActiveTask, fetchPendingTask, fetchCompletedTask]);

  useEffect(() => {
    if (fetchedTasks) {
      fetchAvailableTask();
      fetchActiveTask();
      fetchPendingTask();
      fetchCompletedTask();
      setFetchedTasks(false);
    }
  }, [fetchedTasks, fetchAvailableTask, fetchActiveTask, fetchPendingTask, fetchCompletedTask]);

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
  const [timeOutError, setTimeOutError] = useState(false);
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

  // Optional: handle grace period error
  const setGracePeriodError = useCallback((error) => {
    setTimeOutError(error);
    console.log('Grace period error:', error);
  }, []);

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

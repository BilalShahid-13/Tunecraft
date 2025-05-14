"use client";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import Carousel from '@/components/Carousel';

export default function Dashboard() {
  const { data } = useSession()
  const [session, setSession] = useState(null)
  const [activeTask, setActiveTask] = useState([]);

  useEffect(() => {
    setSession(data)
  }, [data])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/fetch-tasks')
      if (res.statusText === 'OK') {
        console.log(res.data.data)
        setActiveTask(res.data.data)
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  return (
    <div className='flex flex-col justify-start items-start gap-12 font-inter w-full'>
      <div className='flex flex-col justify-start items-start gap-3 font-inter'>
        <h2 className='text-6xl font-semibold'>Welcome back,
          <span className='capitalize'>
            {session?.user.username}</span>
        </h2>
        <p>Here's an overview of your tasks and projects</p>
      </div>
      <div className='space-y-4 w-fit relative max-sm:gap-3
      '>
        <h2 className='border-l-6 border-l-[#ff7e6e] rounded-xs
      text-2xl font-medium font-inter px-4 '>Active Task</h2>
        {/* <ActiveTask /> */}
        <TaskCard badge='active' />
      </div>
      <div className='space-y-4 w-full relative max-sm:gap-3
      '>
        <h2 className='border-l-6 border-l-[#0e8fd5] rounded-xs
      text-2xl font-medium font-inter px-4 '>Available Task</h2>
        {/* <TaskCard title={activeTask}/> */}
        <Carousel useDefaultData={true}
          Component={
            <div className='flex flex-row'>
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
              <TaskCard badge='active' />
            </div>
          }
          steps={true} />
      </div>
    </div>
  )
}

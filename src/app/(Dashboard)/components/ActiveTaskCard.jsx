"use client";
import useSidebarWidth from '@/store/sidebarWidth';
import React, { Suspense } from 'react';
import TaskCard from './TaskCard';
import { SkeletonCard } from './TaskLayoutRoot';


function NoAvailableTasks({ msg }) {
  return (
    <p className='text-zinc-600 font-inter italic ml-zinc-600 ml-23'>No {msg} Task Yet</p>
  )
}

export default function ActiveTaskCard({ taskName = 'active'
  , tasks, session, inReview = false, isLoading }) {
  const { width } = useSidebarWidth();

  function handleTaskColor(taskName) {
    switch (taskName) {
      case 'active':
        return 'border-l-red-400'
      case 'available':
        return 'border-l-blue-400'
      case 'completed':
        return 'border-l-green-400'
    }
  }
  return (
    <>
      <div
        className='space-y-4 w-full relative max-sm:gap-3 overflow-x-hidden'
      >
        <h2 className={`border-l-6 ${handleTaskColor(taskName)}
       rounded-xs text-2xl font-medium font-inter
 px-4 max-sm:text-lg capitalize`}>{taskName} Task</h2>
        <Suspense
          fallback={<SkeletonCard />}>
          <div className={`grid
          ${width ? `
          ${taskName === 'available' ? `grid-cols-4 max-lg:grid-cols-2
          max-xl:grid-cols-2` :
                `max-lg:grid-cols-2 max-xl:grid-cols-3
                grid-cols-3 max-md:grid-cols-2`}
          ` :
              `${taskName === 'available' ? `grid-cols-3 max-lg:grid-cols-1
               ` :
                `grid-cols-2 max-lg:grid-cols-1
            max-md:grid-cols-1 max-xl:grid-cols-2`}`}
                   gap-4 max-sm:grid-cols-1 max-xs:grid-cols-1`}>
            {isLoading ? (
              <SkeletonCard />
            ) : !tasks || tasks.length === 0 ? (
              <NoAvailableTasks msg={taskName} />
            ) : (
              tasks.map((item, index) => (
                <React.Fragment key={index}>
                  <TaskCard
                    key={index}
                    index={index}
                    badge={taskName}
                    musicTemplate={item?.title}
                    inReview={inReview}
                    title={item?.songGenre}
                    session={session}
                    des={item?.jokes}
                    plan={item?.plan}
                    songGenre={item?.songGenre}
                    item={item}
                    assignedAtTime={item?.dueDate}
                    currentStage={item?.currentStage}
                  />
                </React.Fragment>
              ))
            )}

          </div>
        </Suspense>
      </div>
    </>
  )
}

import React from 'react'
import UserProfile from './UserProfile'

export default function DashboardNavbar({ link }) {
  let heading = link.replace('/', '')
  return (
    <>
      <div className='w-full flex flex-row justify-between items-center px-2 py-1 bg-zinc-900 shadow-2xl shadow-zinc-700'>
        <h3 className='capitalize font-inter font-semibold'>{heading} Dashboard</h3>
        <UserProfile />
      </div>
    </>
  )
}

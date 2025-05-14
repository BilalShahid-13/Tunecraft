"use client";
import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'
import useAllUsers from '@/store/allUsers'

export default function PendingApproval() {
  const { pendingUser } = useAllUsers()
  const [pendingUsers, setpendingUsers] = useState([])

  useEffect(() => {
    if (pendingUser) {
      setpendingUsers(pendingUser)
    }
  }, [pendingUser])

  return (
    <>
      <UserCard users={pendingUsers} userStatus='pending'/>
    </>
  )
}

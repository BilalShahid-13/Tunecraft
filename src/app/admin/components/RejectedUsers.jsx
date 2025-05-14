"use client";
import useAllUsers from '@/store/allUsers'
import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'

export default function RejectedUsers() {
  const { rejectedUser } = useAllUsers()
  const [rejectedUsers, setrejectedUsers] = useState([])

  useEffect(() => {
    if (rejectedUser) {
      setrejectedUsers(rejectedUser)
    }
  }, [rejectedUser])
  return (
    <>
      <UserCard users={rejectedUsers} userStatus={'rejected'}/>
    </>
  )
}

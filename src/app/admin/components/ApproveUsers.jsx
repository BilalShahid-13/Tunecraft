"use client";
import useAllUsers from '@/store/allUsers';
import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';

export default function ApproveUsers() {
  const { activeUser } = useAllUsers()
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    if (activeUser) {
      setActiveUsers(activeUser)
    }
  }, [activeUser])

  return (
    <>
      <UserCard users={activeUsers} approveUser={true}/>
    </>
  )
}

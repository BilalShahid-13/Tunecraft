"use client";
import useAllUsers from '@/store/allUsers';
import { useEffect, useState } from 'react';
import UserCard from '../UserCard';

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
      <UserCard users={pendingUsers} userStatus='pending' />
    </>
  )
}

"use client";
import React, { useEffect, useState } from 'react';
import useAllUsers from '@/store/allUsers'
import AdminTaskCard from '../AdminTaskCard';

export default function pendingApproval() {
  const { pendingUser } = useAllUsers()
  const [pendingUsers, setpendingUsers] = useState([])

  useEffect(() => {
    if (pendingUser) {
      setpendingUsers(pendingUser)
    }
  }, [pendingUser])
  return (
    <>
      <AdminTaskCard />
    </>
  )
}

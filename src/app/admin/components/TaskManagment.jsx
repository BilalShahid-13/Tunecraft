"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import AdminTaskCard from './AdminTaskCard';
import useAllUsers from '@/store/allUsers';

export default function TaskManagment() {
  const [allSubmission, setAllSubmissions] = useState();
  const [allcrafters, setAllCrafters] = useState([])
  const [user, setUser] = useState([])
  const [role, setRole] = useState('lyricist')
  const [isLoading, setIsLoading] = useState(false)
  const { isFetched } = useAllUsers()
  useEffect(() => {
    fetchReviewSubmissions();
  }, [isFetched])

  const fetchReviewSubmissions = async () => {
    try {
      const response = await axios.get('/api/admin/crafters-submission-review')
      if (response.status === 200) {
        console.log('all', response.data.data)
        setAllSubmissions(response.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  }
  // console.log('allCrafters', allcrafters, 'allSubmission', allSubmission)
  // useEffect(() => {
  //   const a = allSubmission?.map((items) => {
  //     const { lyricist, singer, engineer } = items.crafters;
  //     const obj = {};
  //     if (lyricist?.submissionStatus === "submitted") {
  //       obj.lyricist = lyricist
  //       setRole('singer')
  //     }
  //     if (singer?.submissionStatus === "submitted") {
  //       obj.singer = singer
  //       setRole('engineer')
  //     }
  //     if (engineer?.submissionStatus === "submitted") {
  //       obj.engineer = engineer
  //       setRole('engineer')
  //     }
  //     return obj
  //   })
  //   setAllCrafters(a)
  // }, [allSubmission])


  const onApprove = async (id) => {
    console.log('onclick', id, role)
    try {
      setIsLoading(id)
      const res = await axios.patch('/api/admin/crafter-approve', {
        orderId: id,
        role: role
      })
      if (res.status === 200) {
        console.log(res.data)
      }
    }
    catch (error) {
      console.error(error.response.data.error);
    }
    finally {
      setIsLoading(false)
    }
  }

  // console.log(allSubmission[0]?.submittedCrafter.assignedCrafterId.username)

  return (
    <div className='flex flex-col gap-3'>
      {allSubmission && allSubmission.map((item, index) =>
        <AdminTaskCard key={index}
          index={index}
          item={item}
          username={item.submittedCrafter.assignedCrafterId.username}
          email={item.submittedCrafter.assignedCrafterId.email}
          file={item.submittedCrafter.submittedFileUrl}
          time={item.submittedCrafter.submittedAtTime}
          isLoading={isLoading}
          onClick={() => onApprove(item?._id)} />)}
    </div>
  )
}

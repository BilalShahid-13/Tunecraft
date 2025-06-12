"use client";
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import useAllUsers from '@/store/allUsers';
import { Loader } from '@/utils/Skeleton';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import AdminTaskCard from '../AdminTaskCard';

export default function AllCrafters() {
  const { addAllUser, setIsUpdate, isFetched } = useAllUsers()
  const [allCrafters, setAllCrafter] = useState([]);
  const [isScroll, setIsScroll] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const cardRefs = useRef({});
  useSmoothScroll(cardRefs, isScroll);

  useEffect(() => {
    fetchAllUsers();
    console.log("isFetched allCrafters", isFetched)
  }, [isFetched, setIsUpdate])


  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/admin/get-all-Crafters')
      console.log(res.data.data)
      setAllCrafter(res.data.data)
      setIsScroll(true);
      addAllUser({ users: res.data.data, mode: "task", task: res.data.data });
      if (res.status === 200) {
        setIsUpdate(false);
      }
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {isLoading ? <Loader /> : <div className='flex flex-col gap-5'>
        {allCrafters.length === 0 ?
          <p className="text-sm text-gray-500">No Crafters</p> : allCrafters.map((item, index) => <AdminTaskCard
            key={index}
            ref={(el) => {
              cardRefs.current[item.assignedCrafterId._id] = el;
            }}
            item={item}
            orderName={item.musicTemplate}
            planName={item.plan.name}
            planPrice={item.plan.price}
            crafterId={item.orderId}
            ordererName={item.assignedCrafterId.username}
            ordererEmail={item?.assignedCrafterId.email}
            tab={'allCrafters'}
            songGenre={item.songGenre}
            backgroundStory={item.backgroundStory}
            jokes={item.jokes}
            role={item?.role}
            crafterUsername={item?.crafterUsername}
            crafterEmail={item?.crafterEmail}
            penaltyCount={item?.penaltyCount}
            crafterComments={item?.crafterFeedback}
            file={item.submittedFile}
            time={item.submittedAtTime}
            revisionAttempts={item.revisionAttempts}
            userStatus={(item.revisionAttempts > 0 && item?.submissionStatus === "submitted") ? "review" : item?.submissionStatus}
            isLoading={isLoading}
          />)}
      </div>}
    </>
  )
}

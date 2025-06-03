"use client";
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import useAllUsers from '@/store/allUsers';
import { Loader } from '@/utils/Skeleton';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import AdminTaskCard from '../AdminTaskCard';

export default function AllCrafters() {
  const { addAllUser, setIsUpdate } = useAllUsers()
  const [allCrafters, setAllCrafter] = useState();
  const [isScroll, setIsScroll] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const cardRefs = useRef({});
  useEffect(() => {
    fetchAllUsers();
  }, [])

  useSmoothScroll(cardRefs, isScroll);

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/admin/get-all-Crafters')
      // console.log('all-users', res.data.data)
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
        {allCrafters && allCrafters.map((item) => <AdminTaskCard
          key={item._id}
          ref={(el) => {
            cardRefs.current[item.matchedCrafters[0].assignedCrafterId._id] = el;
          }}
          item={item}
          orderName={item.musicTemplate}
          planName={item.plan.name}
          planPrice={item.plan.price}
          crafterId={item.orderId}
          ordererName={item.name}
          ordererEmail={item.email}
          songGenre={item.songGenre}
          backgroundStory={item.backgroundStory}
          jokes={item.jokes}
          role={item?.matchedCrafters[0]?.role}
          crafterUsername={item.matchedCrafters[0].assignedCrafterId.username}
          crafterEmail={item.matchedCrafters[0].assignedCrafterId.email}
          penaltyCount={item.matchedCrafters[0].penaltyCount}
          crafterComments={item.matchedCrafters[0].crafterFeedback}
          file={item.matchedCrafters[0].submittedFile}
          time={item.matchedCrafters[0].submittedAtTime}
          userStatus={item.matchedCrafters[0].submissionStatus}
          isLoading={isLoading}
          onClick={() => onApprove(item._id)}
        />)}
      </div>}
    </>
  )
}

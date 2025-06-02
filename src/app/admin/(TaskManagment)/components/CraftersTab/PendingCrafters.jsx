"use client";
import { Skeleton } from '@/components/ui/skeleton';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import useAllUsers from '@/store/allUsers';
import axios from 'axios';
import { useRef, useState } from 'react';
import AdminTaskCard from '../AdminTaskCard';

export default function PendingCrafters() {
  const [role, setRole] = useState('lyricist');
  const [isLoading, setIsLoading] = useState(false);
  const { pendingUser } = useAllUsers();
  const cardRefs = useRef({});

  useSmoothScroll(cardRefs, true)

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

  return (
    pendingUser && pendingUser.map((item, index) => <AdminTaskCard
      key={index}
      ref={(el) => {
        cardRefs.current[item.matchedCrafters[0].assignedCrafterId._id] = el;
      }}
      item={item}
      orderName={item.musicTemplate}
      planName={item.plan?.name}
      planPrice={item.plan.price}
      crafterId={item.orderId}
      ordererName={item?.name}
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
    />)
  )
}

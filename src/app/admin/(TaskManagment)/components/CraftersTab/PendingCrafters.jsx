"use client";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import useAllUsers from '@/store/allUsers';
import { useEffect, useRef, useState } from 'react';
import AdminTaskCard from '../AdminTaskCard';

export default function PendingCrafters() {
  const [isLoading, setIsLoading] = useState(false);
  const { pendingUser } = useAllUsers();
  const [allPendingUser, setAllPendingUser] = useState([])
  const cardRefs = useRef({});

  useEffect(() => {
    if (pendingUser)
      setAllPendingUser(pendingUser)
  })

  useSmoothScroll(cardRefs, true)

  const onApprove = async (id) => {
    // try {
    //   setIsLoading(id)
    //   const res = await axios.patch('/api/admin/crafter-approve', {
    //     orderId: id,
    //     role: role
    //   })
    //   if (res.status === 200) {
    //     console.log(res.data)
    //   }
    // }
    // catch (error) {
    //   console.error(error.response.data.error);
    // }
    // finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 mt-2 px-4">
        {allPendingUser?.length === 0 ? (
          <p className="text-sm text-gray-500">No Pending Crafters.</p>
        ) : (
          allPendingUser && allPendingUser.map((item, index) =>
            <AdminTaskCard
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
              tab={'pendingCrafters'}
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
            />))
        }
      </div>
    </ScrollArea>
  )
}

"use client";
import axios from 'axios';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import AdminTaskCard from './AdminTaskCard';
import useAllUsers from '@/store/allUsers';
import useNotificationStore from '@/store/notification';
import { Skeleton } from '@/components/ui/skeleton';

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default function TaskManagment() {
  const [allSubmission, setAllSubmissions] = useState();
  const [user, setUser] = useState([])
  const [role, setRole] = useState('lyricist')
  const [isLoading, setIsLoading] = useState(false)
  const { isFetched } = useAllUsers()
  useEffect(() => {
    fetchReviewSubmissions();
  }, [isFetched])

  const { isClicked, setClicked, notificationId } = useNotificationStore()
  const cardRefs = useRef({});

  const scrollToCard = useCallback(() => {
    console.log("Scrolling to notificationId:", notificationId);
    if (notificationId && cardRefs.current[notificationId]) {
      console.log("Found card ref for:", notificationId);
      cardRefs.current[notificationId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setClicked(false);
    } else {
      console.log("No card ref found for:", notificationId);
    }
  }, [notificationId]);


  useEffect(() => {
    // Delay the scroll by a short time to ensure the element is rendered
    if (isClicked) {
      setTimeout(scrollToCard, 200);
    }
  }, [scrollToCard]);

  const fetchReviewSubmissions = async () => {
    // setIsLoading(true)
    try {
      const response = await axios.get('/api/admin/crafters-submission-review')
      if (response.status === 200) {
        console.log('all', response.data.data)
        setAllSubmissions(response.data.data)
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      // setIsLoading(false)
    }
  }

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
    <div className='flex flex-col gap-3 justify-center items-center w-full'>
      <Suspense fallback={<SkeletonCard />}>
        {allSubmission && allSubmission.map((item, index) =>
          <AdminTaskCard key={index}
            index={index}
            item={item}
            orderName={item.musicTemplate}
            planName={item.plan.name}
            planPrice={item.plan.price}
            crafterId={item.submittedCrafter.assignedCrafterId.crafterId}
            role={item.submittedCrafter.role}
            username={item.submittedCrafter.assignedCrafterId.username}
            email={item.submittedCrafter.assignedCrafterId.email}
            file={item.submittedCrafter.submittedFile}
            time={item.submittedCrafter.submittedAtTime}
            isLoading={isLoading}
            onClick={() => onApprove(item?._id)} />)}
      </Suspense>
    </div>
  )
}

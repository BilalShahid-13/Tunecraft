"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import useAllUsers from "@/store/allUsers";
import { useRef } from "react";
import AdminTaskCard from "../AdminTaskCard";
export default function ApprovedCrafter() {
  const { activeUser } = useAllUsers();
  const cardRefs = useRef({});
  useSmoothScroll(cardRefs, true);

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 mt-2 px-4">
        {activeUser?.length === 0 ? (
          <p className="text-sm text-gray-500">No Approved Crafters.</p>
        ) : (
          activeUser.map((item, index) => (
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
              tab={'approvedCrafters'}
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
              userStatus={item?.submissionStatus}
            // isLoading={isLoading}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
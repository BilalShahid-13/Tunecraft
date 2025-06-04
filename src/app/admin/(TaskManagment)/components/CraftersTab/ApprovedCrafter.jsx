"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import useAllUsers from "@/store/allUsers";
import { useRef, useState } from "react";
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
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
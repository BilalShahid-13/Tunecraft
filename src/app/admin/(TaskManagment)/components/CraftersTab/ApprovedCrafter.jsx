"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import useAllUsers from "@/store/allUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminTaskCard from "../AdminTaskCard";
export default function ApprovedCrafter() {
  const { activeUser } = useAllUsers();
  const [role, setRole] = useState("lyricist");
  const [isLoading, setIsLoading] = useState(null);

  // We keep refs to each card so that a scroll‐to‐card logic (if needed) can be applied later
  const cardRefs = useRef({});

  //
  //  1) Build a “flat” array of props for AdminTaskCard ONE TIME per activeUser change

  const cardsData = useMemo(() => {
    return activeUser.map((order) => {
      // We assume matchedCrafters is already filtered to only “submitted” items
      const crafter = (order.matchedCrafters && order.matchedCrafters[0]) || {};

      return {
        id: order._id,                 // will become the React key
        orderName: order.musicTemplate,
        planName: order.plan.name,
        planPrice: order.plan.price,
        orderId: order.orderId,
        ordererName: order.name,
        ordererEmail: order.email,
        songGenre: order.songGenre,
        backgroundStory: order.backgroundStory,
        jokes: order.jokes,

        // nested crafter info:
        role: crafter.role,
        crafterUsername: crafter.assignedCrafterId?.username,
        crafterEmail: crafter.assignedCrafterId?.email,
        penaltyCount: crafter.penaltyCount,
        crafterComments: crafter.crafterFeedback,
        file: crafter.submittedFile,
        time: crafter.submittedAtTime,
        userStatus: crafter.submissionStatus,
      };
    });
  }, [activeUser]);

  const onApprove = useCallback(
    async (orderId) => {
      setIsLoading(orderId);
      try {
        await axios.patch("/api/admin/crafter-approve", {
          orderId,
          role,
        });
        // → If you want to refresh the list or update Zustand, do it here
      } catch (err) {
        console.error(err.response?.data?.error);
      } finally {
        setIsLoading(null);
      }
    },
    [role]
  );

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 mt-2 px-4">
        {cardsData.length === 0 ? (
          <p className="text-sm text-gray-500">No pending submissions.</p>
        ) : (
          cardsData.map((data) => (
            <AdminTaskCard
              key={data.id}
              ref={(el) => {
                cardRefs.current[data.id] = el;
              }}
              // If AdminTaskCard expects a single `item` prop, you can pass the entire data object:
              item={data}

              // Or you can spread each prop individually:
              orderName={data.orderName}
              planName={data.planName}
              planPrice={data.planPrice}
              crafterId={data.orderId}
              ordererName={data.ordererName}
              ordererEmail={data.ordererEmail}
              songGenre={data.songGenre}
              backgroundStory={data.backgroundStory}
              jokes={data.jokes}
              role={data.role}
              crafterUsername={data.crafterUsername}
              crafterEmail={data.crafterEmail}
              penaltyCount={data.penaltyCount}
              crafterComments={data.crafterComments}
              file={data.file}
              time={data.time}
              userStatus={data.userStatus}

              isLoading={isLoading === data.id}
              onClick={() => onApprove(data.id)}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
"use client";

import { adminPanel } from "@/lib/Constant";
import useNotificationStore from "@/store/notification";
import NotificationCard from "./NotificationCard";
import useTabValue from "@/store/tabValue";
import { useState, useMemo } from "react";
import { ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Notification() {
  const [sortOrder, setSortOrder] = useState("desc"); // default descending
  const { allNotifications, setClicked, clickedNotification } = useNotificationStore();
  const { setTabValue } = useTabValue();

  // Memoize the sorted list so it only recomputes when allNotifications or sortOrder change
  const sorted = useMemo(() => {
    if (!allNotifications) return [];
    return [...allNotifications].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [allNotifications, sortOrder]);

  console.log('allNotifications',allNotifications)

  return (
    <div className="space-y-3">
      {/* Sorting dropdown */}
      <div className="flex justify-end">
        <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
          <SelectTrigger className="w-40 flex items-center gap-2">
            <ListFilter size={16} />
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order</SelectLabel>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Notification cards */}
      <div className="flex flex-col gap-4">
        {sorted.map((item) => (
          <NotificationCard
            key={item._id}
            time={item.createdAt}
            approvalStatus={item.approvalStatus}
            status={item.status}
            username={item.username}
            role={item.role}
            crafterId={item.orderId || item.crafterId}
            onClick={() => {
              setClicked(true);
              clickedNotification(item._id);

              if (item.status === "Crafter Registration") {
                setTabValue({
                  value: adminPanel[0].name,
                  userStatus: item.approvalStatus,
                });
              } else if (item.status === "Task Submission") {
                setTabValue({
                  value: adminPanel[1].name,
                  userStatus: item.approvalStatus,
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

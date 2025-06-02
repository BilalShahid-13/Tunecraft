"use client";

import { adminPanel } from "@/lib/Constant";
import useNotificationStore from "@/store/notification";
import NotificationCard from "./NotificationCard";
import useTabValue from "@/store/tabValue";
import { useEffect, useState } from "react";
import { ListFilter } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Notification() {
  const [sorted, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default descending
  const { allNotifications, setClicked, clickedNotification } = useNotificationStore();
  const { setTabValue } = useTabValue();
  useEffect(() => {
    if (allNotifications) {
      const sortedData = [...allNotifications].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
      setSortedData(sortedData);
    }
  }, [allNotifications, sortOrder]);

  return (
    <div className="space-y-3">
      {/* Sorting buttons */}
      <div className="flex justify-end">
        <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
          <SelectTrigger className="w-40 flex items-center gap-2">
            <ListFilter size={16} />
            <SelectValue placeholder="ListFilter" />
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
        {sorted.map((item, index) => (
          <NotificationCard
            key={index}
            time={item.createdAt}
            approvalStatus={item?.approvalStatus}
            status={item?.status}
            username={item.username}
            role={item.role}
            //  crafterId = orderId
            crafterId={item.orderId || item.crafterId}
            onClick={() => {
              if (item.status === "Crafter Registration") {
                setClicked(true);
                clickedNotification(item._id);
                setTabValue({ value: adminPanel[0].name, userStatus: item.approvalStatus });
              } if (item.status === "Task Submission") {
                setClicked(true);
                clickedNotification(item._id);
                setTabValue({ value: adminPanel[1].name, userStatus: item.approvalStatus });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

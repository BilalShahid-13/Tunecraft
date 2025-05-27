import { adminPanel } from "@/lib/Constant";
import useNotificationStore from "@/store/notification";
import NotificationCard from "./NotificationCard";
import useTabValue from "@/store/tabValue";

export default function Notification() {
  const { notifications, setClicked, clickedNotification } = useNotificationStore()
  const { setTabValue } = useTabValue()
  return (
    <div className="flex flex-col gap-4">
      {notifications.approvalNotification.map((item, index) => (
        <NotificationCard key={index}
          // updates at but now its createdAt
          time={item.createdAt}
          approvalStatus={item.approvalStatus}
          username={item.username}
          role={item.role}
          crafterId={item.crafterId}
          onClick={() => {
            if (item.approvalStatus) {
              setClicked(true)
              clickedNotification(item._id)
              setTabValue({ value: adminPanel[0].name, userStatus: item.approvalStatus })
            }
          }} />
      ))}
      {notifications.craftersNotification.map((item, index) => (
        <NotificationCard key={index}
          time={item.assignedAtTime}
          approvalStatus={'pending'}
          username={item.crafterName}
          status={'Task Submission'}
          email={item.crafterEmail}
          role={item.crafterRole}
          crafterId={item.crafterId}
          onClick={() => {
            setClicked(true)
            clickedNotification(item._id)
            setTabValue({ value: adminPanel[1].name })
          }} />
      ))}
    </div>
  )
}

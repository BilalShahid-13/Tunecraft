import { adminPanel } from "@/lib/Constant";
import useNotificationStore from "@/store/notification";
import NotificationCard from "./NotificationCard";

export default function Notification() {
  const { notifications, setTabValue, setClicked } = useNotificationStore()
  return (
    <>
      {notifications.approvalNotification.map((item, index) => (
        <NotificationCard key={index} time={item.createdAt}
          onClick={() => {
            if (item.approvalStatus) {
              setClicked(true)
              setTabValue(adminPanel[0].name)
            }
          }} />
      ))}
    </>
  )
}

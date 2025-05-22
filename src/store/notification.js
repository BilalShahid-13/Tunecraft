import { create } from "zustand";

const useNotificationStore = create((set) => ({
  //  unused state notifications
  notifications: {
    approvalNotification: [],
    craftersNotification: [],
  },
  totalNotifications: 0,
  notificationId: null,
  isFetched: false,
  isClicked: false,

  setApprovalNotifications: (notifications) =>
    set(() => {
      // Sort notifications descending by updatedAt
      const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        // (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      // Count how many have approvalStatus === 'pending'
      const totalPendingNotifications = notifications.filter(
        (n) => n.approvalStatus === "pending"
      ).length;

      return {
        notifications: {
          approvalNotification: sortedNotifications,
        },
        totalNotifications: totalPendingNotifications,
      };
    }),

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  },
  removeAllNotification: () => {
    set(() => ({
      notifications: [],
    }));
  },
  clickedNotification: (id) => {
    set(() => ({
      notificationId: id,
    }));
  },

  setIsUpdate: (isfetch) =>
    set({
      isFetched: isfetch,
    }),

  // setClicked to defaultTab to become allUsers
  setClicked: (isClicked) =>
    set(() => ({
      isClicked: isClicked,
    })),
}));

export default useNotificationStore;

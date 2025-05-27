import { create } from "zustand";

const useNotificationStore = create((set) => ({
  //  unused state notifications
  notifications: {
    approvalNotification: [],
    craftersNotification: [
      {
        orderName: "Birthday Song",
        Price: 1500,
        PlanName: "Basic",
        assignedAtTime: "2023-10-01T10:00:00Z",
        crafterId: "T001",
        crafterName: "John Doe",
        crafterEmail: "",
        crafterRole: "",
        fileUrls: [],
      },
    ],
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
          type: "User Registration",
        },
        totalNotifications: totalPendingNotifications,
      };
    }),

  setCraftersNotifications: (newNotifications) =>
    set((state) => {
      // safely grab existing array (or default to empty)
      const existing = Array.isArray(state.notifications?.craftersNotification)
        ? state.notifications.craftersNotification
        : [];

      return {
        notifications: {
          ...state.notifications, // keep approvalNotification, etc.
          craftersNotification: [
            ...existing,
            ...newNotifications, // append new crafter notifications
          ],
          type: "Crafter Submission", // add your crafters‐notification type here
        },
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

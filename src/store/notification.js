import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: {
    approvalNotification: [],
    craftersNotification: [],
  },
  tabValue: "Crafters Management",
  defaultValue: "Crafters Management",
  totalNotifications: 0,
  notificationId: null,
  isFetched: false,
  isClicked: false,

  setApprovalNotifications: (notifications) =>
    set(() => ({
      notifications: {
        approvalNotification: [...notifications],
      },
      totalNotifications: notifications.length,
    })),

  // setClickedNotification: (id, approvalStatus) => {
  //   set((state) => {
  //     const tabValue =
  //       approvalStatus === "pending" || approvalStatus === "true"
  //         ? adminPanel[0].name
  //         : "crafterManagement"; // or whatever fallback tab name you want

  //     return {
  //       notificationId: id,
  //       tabValue,
  //     };
  //   });
  // },

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

  setTabValue: (value) =>
    set(() => ({
      tabValue: value,
    })),

  setDefaultValue: (value) =>
    set(() => ({
      defaultValue: value,
    })),

  setIsUpdate: (isfetch) =>
    set({
      isFetched: isfetch,
    }),

  setClicked: (isClicked) =>
    set(() => ({
      isClicked: isClicked,
    })),
}));

export default useNotificationStore;

import { create } from "zustand";

const useTabValue = create((set, get) => ({
  tabValue: "Crafters Management",
  userStatus: "pending",
  defaultValue: "Crafters Management",

  setTabValue: ({ value, userStatus } = {}) => {
    let newUserStatus = userStatus;

    if (userStatus === "pending") {
      newUserStatus = "1";
    } else if (userStatus === "approved") {
      newUserStatus = "2";
    } else if (userStatus === "rejected") {
      newUserStatus = "3";
    }

    set({
      tabValue: value,
      userStatus: newUserStatus,
    });
  },

  setDefaultValue: (value) => set({ defaultValue: value }),
}));

export default useTabValue;

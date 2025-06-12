// store/allUsers.js
import { create } from "zustand";

const useAllUsers = create((set) => ({
  allUser: [],
  pendingUser: [],
  activeUser: [],
  rejectedUser: [],
  isFetched: false,
  crafterManagement: "crafters",

  addAllUser: ({ users = [], mode = "crafters", task = [] }) => {
    if (!Array.isArray(users)) {
      set({
        allUser: [],
        pendingUser: [],
        activeUser: [],
        rejectedUser: [],
      });
      return;
    }

    let pending = [];
    let approved = [];
    let rejected = [];

    if (mode === "crafters") {
      pending = users.filter((u) => u.approvalStatus === "pending");
      approved = users.filter((u) => u.approvalStatus === "approved");
      rejected = users.filter((u) => u.approvalStatus === "rejected");
    } else if (mode === "task") {
      approved = task.filter((item) => item.submissionStatus === "approved");
      pending = task.filter((item) => item.submissionStatus === "submitted");
      rejected = []; // (no logic shown for “rejected” in task mode)
    }

    set({
      allUser: users,
      pendingUser: pending,
      activeUser: approved,
      rejectedUser: rejected,
    });
  },

  removeUser: (userId) =>
    set((state) => ({
      allUser: state.allUser.filter(
        (user) => user.assignedCrafterId._id !== userId
      ),
      pendingUser: state.pendingUser.filter(
        (user) => user.assignedCrafterId._id !== userId
      ),
      activeUser: state.activeUser.filter(
        (user) => user.assignedCrafterId._id !== userId
      ),
      rejectedUser: state.rejectedUser.filter(
        (user) => user.assignedCrafterId._id !== userId
      ),
    })),

  setIsUpdate: (isfetch) =>
    set({
      isFetched: isfetch,
    }),

  setCrafterManagement: (value) =>
    set({
      crafterManagement: value,
    }),
}));

export default useAllUsers;

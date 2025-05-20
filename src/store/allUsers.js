import { create } from "zustand";

const useAllUsers = create((set) => ({
  allUser: [],
  pendingUser: [],
  activeUser: [],
  rejectedUser: [],
  userRole: [],
  isFetched: false,

  addAllUser: (users) => {
    const pending = users.filter((user) => user.approvalStatus === "pending");
    const approved = users.filter((user) => user.approvalStatus === "approved");
    const rejected = users.filter((user) => user.approvalStatus === "rejected");

    set({
      allUser: users,
      pendingUser: pending,
      activeUser: approved,
      rejectedUser: rejected,
    });
  },

  setIsUpdate: (isfetch) =>
    set({
      isFetched: isfetch,
    }),
}));

export default useAllUsers;

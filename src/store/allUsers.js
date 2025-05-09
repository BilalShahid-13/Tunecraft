import { create } from "zustand";

const useAllUsers = create((set) => ({
  allUser: [],
  pendingUser: [],
  activeUser: [],
  userRole: [],
  isFetched: false,

  addAllUser: (users) => {
    const pending = users.filter((user) => user.isApproved === false);
    const approved = users.filter((user) => user.isApproved === true);

    set({
      allUser: users,
      pendingUser: pending,
      activeUser: approved,
    });
  },

  setIsUpdate: (isfetch) =>
    set({
      isFetched: isfetch,
    }),
}));

export default useAllUsers;

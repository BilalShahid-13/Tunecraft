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
      // — build “approved” orders (only include orders whose matchedCrafters includes at least one approved crafter)
      approved = task
        .map((taskItem) => {
          const filteredApprovalData = (taskItem.matchedCrafters || []).filter(
            (crafter) => crafter.submissionStatus === "approved"
          );
          return {
            // copy whatever top‐level fields you need
            _id: taskItem._id,
            orderId: taskItem.orderId,
            name: taskItem.name,
            phone: taskItem.phone,
            email: taskItem.email,
            songGenre: taskItem.songGenre,
            jokes: taskItem.jokes,
            backgroundStory: taskItem.backgroundStory,
            plan: taskItem.plan, // ← leave as an object (or wrap in [ ] if you really need an array)
            musicTemplate: taskItem.musicTemplate,
            currentStage: taskItem.currentStage,
            orderStatus: taskItem.orderStatus,
            finalSongUrl: taskItem.finalSongUrl,
            createdAt: taskItem.createdAt,
            updatedAt: taskItem.updatedAt,

            matchedCrafters: filteredApprovalData,
          };
        })
        .filter((obj) => obj.matchedCrafters.length > 0); // drop any order with zero approved crafters

      // — build “pending” orders (only include orders whose matchedCrafters includes at least one submitted crafter)
      pending = task
        .map((taskItem) => {
          const filteredPendingData = (taskItem.matchedCrafters || []).filter(
            (crafter) => crafter.submissionStatus === "submitted"
          );
          return {
            _id: taskItem._id,
            orderId: taskItem.orderId,
            name: taskItem.name,
            phone: taskItem.phone,
            email: taskItem.email,
            songGenre: taskItem.songGenre,
            jokes: taskItem.jokes,
            backgroundStory: taskItem.backgroundStory,
            plan: taskItem.plan, // ← same note as above
            musicTemplate: taskItem.musicTemplate,
            currentStage: taskItem.currentStage,
            orderStatus: taskItem.orderStatus,
            finalSongUrl: taskItem.finalSongUrl,
            createdAt: taskItem.createdAt,
            updatedAt: taskItem.updatedAt,

            matchedCrafters: filteredPendingData,
          };
        })
        .filter((obj) => obj.matchedCrafters.length > 0);

      rejected = []; // (no logic shown for “rejected” in task mode)
    }

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

  setCrafterManagement: (value) =>
    set({
      crafterManagement: value,
    }),
}));

export default useAllUsers;

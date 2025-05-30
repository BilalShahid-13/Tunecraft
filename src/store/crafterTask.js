import { create } from "zustand";

const useCrafterTask = create((set) => ({
  crafterTask: {
    orderId: "",
    title: "",
    des: "",
    requirements: "",
    clientName: "",
    dueData: "",
    submittedFileUrls: [],
  },
  userStatus: "active",

  setCrafterTask: (task, status) => {
    set({ crafterTask: task, userStatus: status });
  },
}));

export default useCrafterTask;

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

  setCrafterTask: (task) => {
    set({ crafterTask: task });
  },
}));

export default useCrafterTask;

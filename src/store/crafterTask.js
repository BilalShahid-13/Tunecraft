import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCrafterTask = create(
  persist(
    (set) => ({
      crafterTask: {
        orderId: "",
        title: "",
        des: "",
        requirements: "",
        clientName: "",
        dueData: "",
      },

      setCrafterTask: (task) => {
        if (task.crafterTask) {
          set(() => ({
            crafterTask: task.crafterTask,
          }));
        } else {
          set(() => ({
            crafterTask: task,
          }));
        }
      },
    }),
    {
      name: "crafter-task-storage", // unique name for localStorage key
      // You can add options here like partialize, version, migrate, etc.
    }
  )
);

export default useCrafterTask;

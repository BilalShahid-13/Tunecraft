import { create } from "zustand";

const useTasks = create((set) => ({
  activeTasks: [],
  fetchedTasks: false,

  setFetchedTasks: (isFetched) => {
    set({
      fetchedTasks: isFetched,
    });
  },

  addActiveTasks: (tasks) => {
    set({
      activeTasks: tasks,
    });
  },
  removeActiveTasks: (taskId) => {
    set((state) => ({
      activeTasks: state.activeTasks.filter((task) => task._id !== taskId),
    }));
  },
}));

export default useTasks;

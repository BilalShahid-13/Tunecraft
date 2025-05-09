import { create } from "zustand";

const useSidebarWidth = create((set) => ({
  width: null,

  addSidebarWidth: (width) =>
    set({
      width: width,
    }),
}));

export default useSidebarWidth;

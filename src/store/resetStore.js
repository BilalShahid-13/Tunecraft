import { create } from "zustand";

const useResetStore = create((set) => ({
  email: null,
  otp: null,
  password: null,

  // actions
  addEmail: (email) => set({ email }),
  addOtp: (otp) => set({ otp }),
  addPassword: (password) => set({ password }),
}));

export default useResetStore;

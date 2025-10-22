import { create } from "zustand";

const useUserStore = create((set) => ({
  userId: 5,
  userRole: "student",
  
  storeUser: (id, role) => set({ userId: id, userRole: role }),
  clearUser: () => set({ userId: null, userRole: "" })
}));

export default useUserStore;

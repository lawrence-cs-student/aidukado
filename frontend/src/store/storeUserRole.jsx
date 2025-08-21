import { create } from "zustand";


const useUserRoleStore = create ((set) => ({
    userRole: "",
    storeUserRole: (fetched_role) => set({userRole : fetched_role}),
    clearUserRole: () => set ({userRole: ""})
}))

export default useUserRoleStore;
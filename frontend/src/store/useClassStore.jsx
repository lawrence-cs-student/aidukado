
import { create } from "zustand";


const useClassStore = create((set) => ({
    classId: "",

    storeClassId: (id) => set({classId: id}),
    clearClassId: () => set({classId: ""})
}))

export default useClassStore;
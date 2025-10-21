
import { create } from "zustand";


const useClassStore = create((set) => ({
    classId: null,
    className: "",

    storeClassDetail: (id, name) => set({classId: id, className: name}),
    clearClassId: () => set({classId: null, className: ""}),
    
}))

export default useClassStore;
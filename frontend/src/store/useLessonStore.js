
import { create } from "zustand";

const createLessonStore = create((set) => ({
    lessonId: null,

    storeLessonId: (id) => set({lessonId: id}),
    clearLessonId: () => set({lessonId: null})
}))

export default createLessonStore;  
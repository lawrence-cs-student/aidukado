import {create} from 'zustand'

const storeGeneratedLesson = create ((set) => ({
    lesson: "",
    setLesson: (generatedLesson) => set({lesson: generatedLesson})
}))

export default storeGeneratedLesson;

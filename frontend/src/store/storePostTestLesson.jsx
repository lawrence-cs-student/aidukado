import {create} from 'zustand'

const storeGeneratedLesson = create ((set) => ({
    lesson: "",
    extractedText: "",
    setLesson: (generatedLesson) => set({lesson: generatedLesson}),
    setExtractedText: (extractedText) => set({lesson: extractedText})
}))

export default storeGeneratedLesson;

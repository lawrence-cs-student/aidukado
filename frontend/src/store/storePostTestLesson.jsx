import {create} from 'zustand'

const storeGeneratedLesson = create ((set) => ({
    extractedText: "",
    setExtractedText: (text) => set({extractedText: text})
}))

export default storeGeneratedLesson;

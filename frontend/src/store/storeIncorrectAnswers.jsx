import { create } from "zustand";


const storeIncorrectAnswers = create ((set) => ({
    incorrectAnswers: [],
    setIncorrectAnswers: (answers) => set({ incorrectAnswers: answers})

}))

export default storeIncorrectAnswers;
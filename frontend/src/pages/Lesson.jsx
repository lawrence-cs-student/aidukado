import storeIncorrectAnswers from "../store/storeIncorrectAnswers"
import axios from "axios"
import { useState, useEffect } from "react"
import LoadingAnimation from "../components/Loading"

export default function Lesson() {

    const incorrectAnswers = storeIncorrectAnswers((state) => state.incorrectAnswers)
    const [lesson, setLesson] = useState("");


    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/generate_lesson", incorrectAnswers, {
            headers: {'Content-Type' : "application/json"}
        });

            console.log(response.data.lesson);
            setLesson(response.data.lesson)
            
        } catch(error) {
            console.error("Post failed", error)
        }
    }

    useEffect(() => {
    if (incorrectAnswers && incorrectAnswers.length > 0) {
        handleSubmit();
    } else {
        console.log("Incorrect answers not ready");
    }
}, []);



    return (
        <main className="w-full h-full bg-[#333446] p-8 text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl mb-4">Generated Lesson</h1>

            {lesson && lesson.length > 0 ? (
            <div className="w-[80%] h-auto bg-white text-black rounded-xl shadow-lg p-6 overflow-y-auto whitespace-pre-wrap">
                <pre className="whitespace-pre-wrap break-words">{lesson}</pre>
            </div>
            ) : (
            <LoadingAnimation />
            )}
        </main>
);

}
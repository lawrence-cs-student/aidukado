import Test from '../components/Test'
import storePostTestLesson from '../store/storePostTestLesson'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function PostTest() {
    const [questions, setQuestions] = useState([]);
    const lesson = storePostTestLesson((state) => state.lesson)
    const origFile = storePostTestLesson((state) => state.extractedText)

    useEffect (() => {
        const fetchPostTest = async () =>{
            try {
                const response = await axios.post("http://localhost:8000/post_test", { generatedLesson: lesson, origFile: origFile});
                setQuestions(response.data.questions)
            } catch(error) {
                console.error("Post failed", error)
            }
        };
        if(lesson){
            fetchPostTest();
        }
    }, [lesson])

    return(
        <div>
            <Test questions={questions} title={"Post Test Questions"} />
        </div>
    );
}
import Test from '../components/Test'
import storeGeneratedLesson from '../store/storeGeneratedLesson'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function PostTest() {
    const [questions, setQuestions] = useState([]);
    const lesson = storeGeneratedLesson((state) => state.lesson)

    useEffect (() => {
        const fetchPostTest = async () =>{
            try {
                const response = await axios.post("http://localhost:8000/post_test", lesson, {
                    headers: { 'Content-Type': 'text/plain' }
            });
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
import Test from '../components/Test'
import storePostTestLesson from '../store/storePostTestLesson'
import storeGeneratedLesson from '../store/storeGeneratedLesson'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function PostTest() {
    const [questions, setQuestions] = useState([]);
    const lesson = storeGeneratedLesson((state) => state.lesson)
    const origFile = storePostTestLesson((state) => state.extractedText)
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        setLoading(true);
        const fetchPostTest = async () =>{
            try {
                const response = await axios.post("http://localhost:8000/post_test", { generatedLesson: lesson, origFile: origFile});
                setQuestions(response.data.questions)
            } catch(error) {
                console.error("Post failed", error)
            } finally {
                setLoading(false);
            }
        };
        if(lesson){
            fetchPostTest();
        }
    }, [lesson])
    console.log("Lesson type:", typeof origFile);

    return(
        <div className='w-full h-full bg-[#424874] flex justify-center items-center'>
            {loading && (
                <div className="flex flex-col items-center gap-4 text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-white text-xl font-semibold animate-pulse"> Generating PostTest... Please Wait</div>
                </div>
            )}

            {!loading && questions.length> 0 && (
                <Test questions={questions} title={"Post Test Questions"} />
            )}
            
        </div>
    );
}
import { useNavigate} from "react-router-dom"
import React, {useState} from "react";
import useUserStore from "../store/useUserStore";
import axios from 'axios';
import Test from '../components/studentTest';

export default function SelectedLesson() {
    const navigate = useNavigate();
    const userRole = useUserStore((state) => state.userRole);
    const [lessonId, setLessonId] = useState(2);
    const [quiz, setQuiz] = useState({quiz_content: []});
    const [takeQuiz, setTakeQuiz] =useState(false);
 
    const handleQuiz = async () =>{
        if (userRole.toUpperCase() == "TEACHER") {
            navigate('/teacherAssignments');
        }
        else if (userRole.toUpperCase() == "STUDENT"){
            navigate('/studentTest');
        }
        else{
            navigate('/login');
        }
        
    }

    const handleSummary = async () => {
        navigate('/summary')
    }

    const buttonStyle = "rounded-xl flex justify-center item-center text-[#102E50] bg-[#F4F6FF] font-bold"
    return (
        <div className="w-full h-full flex flex-col items-center sm:p-[4%] gap-[5%]">
            <div className="w-4/5 h-1/4 bg-[#102E50] p-[2%] gap-[2%] rounded-xl">
                <h2 className="font-bold text-3xl text-[#F5C45E]">LESSON 1</h2>
                <h2 className="font-bold text-2xl">Understanding Measures of Tendency</h2>
                <div className="flex sm:gap-[1%] mt-[4%]">
                    <button className={buttonStyle} onClick={handleQuiz} >QUIZ</button>
                    <button className={buttonStyle}>ACTIVITY</button>
                    <button className={buttonStyle} onClick={handleSummary}>SUMMARY</button>
                </div>
            </div>
            <div className="w-4/5 h-3/4 bg-red-500">

            </div>
            {takeQuiz &&(
                <div>
                    <Test quiz={quiz} lesson_id={lessonId} title='quiz' />
                </div>
            )}
        </div>
    )
}
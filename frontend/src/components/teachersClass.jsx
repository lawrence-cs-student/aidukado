
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ClassSubject() {
    const navigate = useNavigate()
    const handleClick = () =>{
        navigate('/lessons')
    }
  return (
    <div>
        <div
            className="
            flex flex-col
            w-3/4 sm:w-[70%]
            min-h-[150px] 
            h-auto         
            rounded-2xl p-5 mt-10 mx-auto
            bg-[#102E50] truncate
        "
        >
            <div className="flex flex-col justify-end w-full flex-grow-[8] rounded-2xl p-2 bg-gray-500"> 
                <p className="text-xl sm:text-2xl font-bold text-white" >SUBJECT TITLE</p>
            </div>
            
        </div>
        <div className="flex flex-row justify-end w-3/4 sm:w-[70%] p-3 mx-auto">
            <button onClick={handleClick} className="w-3/4 sm:w-[25%] shadow-xl rounded p-2 m-3 text-[#102E50] bg-gray-500" > Upload  </button>
        </div>
        
        <div className="flex flex-col w-3/4 sm:w-[70%] shadow-xl p-2 mt-5 mx-auto p-2 bg-gray-100" > PRELIMS </div>
        <div className="flex flex-row w-3/4 sm:w-[70%] p-3 mx-auto">
            <button onClick={handleClick} className="w-3/4 sm:w-[25%] shadow-xl rounded p-2 m-3 text-[#102E50] bg-gray-500" > Lesson 1  </button>
            <div className="w-3/4 sm:w-[25%] shadow-xl rounded p-2 m-3 text-[#102E50] bg-yellow-300" > Lesson 2 </div>
            <div className="w-3/4 sm:w-[25%] shadow-xl rounded p-2 m-3 text-[#102E50] bg-gray-300" > Lesson 3 </div>
        </div>

        

        <div className="flex flex-col w-3/4 sm:w-[70%] shadow-xl p-2 mt-5 mx-auto p-2 bg-gray-100" > MIDTERMS </div>
        <div className="flex flex-row w-3/4 sm:w-[70%] p-3 mx-auto">
            <div className="w-3/4 sm:w-[25%] shadow-xl rounded p-2 m-3 text-[#102E50] bg-gray-500" > Lesson 4 </div>
        </div>
    </div>
  );
}
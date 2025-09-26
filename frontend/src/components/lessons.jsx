
import React from "react";
import { Link } from "react-router-dom";

export default function ClassCard() {
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
          <p className="text-xl sm:text-2xl font-bold text-yellow-500" >Lesson 1</p>
          <p className="text-xl sm:text-2xl font-bold text-white" >Understanding Measures of central tendency</p>

          <div className="flex flex-row w-3/4 sm:w-[70%] p-3 justify-end gap-1">
            <button className="flex flex-col justify-end w-3/4 sm:w-[30%] shadow-xl rounded-2xl p-1 m-2 text-[#102E50] bg-gray-500">
              QUIZ
            </button>
            <button className="flex flex-col justify-end w-3/4 sm:w-[30%] shadow-xl rounded-2xl p-1 m-2 text-[#102E50] bg-gray-500">
              ACTIVITY
            </button>
            <button className="flex flex-col justify-end w-3/4 sm:w-[30%] shadow-xl rounded-2xl p-1 m-2 text-[#102E50] bg-gray-500">
              SUMMARY
            </button>
          </div>
            
        </div>
        <div className="
            flex flex-col
            justify-center
            items-center
            w-3/4 sm:w-[70%]
            min-h-[500px] 
            h-auto        
            rounded p-5 mt-10 mx-auto
            bg-gray-400
        ">
          <p className="text-xl sm:text-2xl font-bold text-white" >FILE VIEWER</p>
        </div >
    </div>
    
  );
}
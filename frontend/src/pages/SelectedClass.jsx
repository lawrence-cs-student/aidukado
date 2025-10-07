
import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import UploadLesson from "./Lesson/UploadLesson";
import LessonCard from "../components/LessonCard";
import TermCard from "../components/TermCard";

export default function SelectedSubject() {
    
  const [isOpen, setIsOpen] = useState(false);
  const panelStyle = "w-full sm:h-[70%] max-w-lg rounded-xl shadow-xl"
  const [successMessage, setSuccessMessage] = useState("");

//   const [lessons, setLessons] = useState([])

  const [fetchLessonsError, setFetchLessonsError] = useState("")
  
  const { classId, term } = useParams();

//   const getLessons = async() => {
//     try {
//         const response = await axios.get(`http://localhost:8000/lessons/getById/${classId}`)
//         setLessons(response.data)
//     } catch(err) {
//         if(err.response?.data?.detail) {
//             setFetchLessonsError(err.response.data.detail)
//         } else {
//             setFetchLessonsError("Network Error")
//          }
//     }
//   }

  

//   useEffect(() => {
//     getLessons();
//   } , [classId])

  const lessons = [
      { id: 1, name: "Intro to Programming", term: "Prelim" },
      { id: 2, name: "Data Structures", term: "Prelim" },
      { id: 3, name: "Algorithms", term: "Midterm" },
      { id: 4, name: "Databases", term: "Final" },
      { id: 5, name: "Operating Systems", term: "Final" },
      { id: 6, name: "Operating Systems", term: "Prelim" },
      { id: 7, name: "Databases", term: "Prelim" },
      { id: 8, name: "Databases", term: "Prelim" },
  ];

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.term === term) 
  }, [lessons, term])

  

  return (
    <div className="flex flex-col w-full h-full p-5 gap-5 items-center">
        <div
            className="
            flex flex-col
            w-3/4 sm:w-[70%]
            min-h-[150px] 
            h-auto         
            p-2
            truncate
            bg-[#F4F6FF]
        "
        >
            <div 
                className="flex flex-col justify-end flex-grow-[8] p-2 
                bg-[#102E50]/80 bg-[url('https://images.pexels.com/photos/895544/pexels-photo-895544.jpeg')] 
                bg-cover bg-center bg-blend-overlay"
            >
                <p className="text-xl sm:text-2xl font-bold text-white" >SUBJECT TITLE</p>
            </div>
            
        </div>

        <div className="flex flex-row w-3/4 sm:w-[70%] mx-auto mt-4">
            <button 
              onClick={() => setIsOpen(true)} 
              className="w-1/2 sm:w-[15%] shadow-xl rounded p-2 text-white font-bold bg-[#F5C45E] 
              hover:bg-[#F4F6FF] hover:text-[#102E50] transition-transform duration-300" 
            > 
              Upload + 
            </button>
            {successMessage && (<p className="text-green-800">{successMessage}</p>)}
        </div>

        <div className="w-3/4 sm:w-[70%] mt-10">
          <h2 className="text-[#F5C45E] font-bold text-2xl">{term}'s Lessons</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 space-between w-3/4 sm:w-[70%]">
            {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lessonName={lesson.name}/>
            ))}
        </div>
        

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload a Lesson" panelStyle={panelStyle}>
            <UploadLesson 
              setSuccessMessage={setSuccessMessage}
              setIsOpen={setIsOpen} 
              term={term}
              onSuccess={() => {
                // getLessons();
                setIsOpen(false);
              }}
            />
        </Modal>
    </div>
  );
}
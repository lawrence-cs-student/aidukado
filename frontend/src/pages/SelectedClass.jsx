
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


//   const [lessons, setLessons] = useState([])

const lessons = [
  // Prelim
  { id: 1, name: "Lesson 1", term: "Prelim" },
  { id: 2, name: "Lesson 2", term: "Prelim" },
  { id: 3, name: "Lesson 3", term: "Prelim" },
  { id: 4, name: "Lesson 4", term: "Prelim" },

  // Midterm
  { id: 5, name: "Lesson 5", term: "Midterm" },
  { id: 6, name: "Lesson 6", term: "Midterm" },
  { id: 7, name: "Lesson 7", term: "Midterm" },
  { id: 8, name: "Lesson 8", term: "Midterm" },

  // Final
  { id: 9, name: "Lesson 9", term: "Midterm" },
  { id: 10, name: "Lesson 10", term: "Final" },
  { id: 11, name: "Lesson 11", term: "Final" },
  { id: 12, name: "Lesson 12", term: "Final" },
  { id: 13, name: "Lesson 12", term: "Final" },
];



  const [fetchLessonsError, setFetchLessonsError] = useState("")
  
  const { id } = useParams();

  const getLessons = async() => {
    try {
        const response = await axios.get(`http://localhost:8000/lessons/getById/${id}`)
        setLessons(response.data)
    } catch(err) {
        if(err.response?.data?.detail) {
            setFetchLessonsError(err.response.data.detail)
        } else {
            setFetchLessonsError("Network Error")
         }
    }
  }

  

  useEffect(() => {
    getLessons();
  } , [id])


  const groupedLessons = useMemo(() => {

    const terms = ["Prelim", "Midterm", "Final"];
    const grouped = {};

    terms.forEach((term) => {
        grouped[term] = lessons.filter((lesson) => lesson.term === term);
    });

    return grouped;
  }, [lessons]);

  

  return (
    <div className="flex flex-col w-full h-full p-5">
        <div
            className="
            flex flex-col
            w-3/4 sm:w-[70%]
            min-h-[150px] 
            h-auto         
            p-2 mx-auto
            truncate
            bg-gradient-to-t from-sky-500 to-indigo-500
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

        <div className="flex flex-row justify-end w-3/4 sm:w-[70%] mt-5 mx-auto">
            <button onClick={() => setIsOpen(true)} className="w-1/2 sm:w-[15%] shadow-xl rounded p-2 text-white font-bold bg-[#F3C623]" > Upload + </button>
        </div>


        {Object.entries(groupedLessons).map(([term, lessons]) => (
            <div key={term} 
                 className="flex flex-col w-3/4 sm:w-[70%] mx-auto h-auto"
            >
                <TermCard term={term.toUpperCase()}/>
                <div className="flex flex-wrap gap-[3%] flex-row w-3/4 sm:w-full sm:h-auto">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.id} lessonName={lesson.name}/>
                    ))}
                </div>
            </div>
        ))}

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload a Lesson" panelStyle={panelStyle}>
            <UploadLesson setIsOpen={setIsOpen}/>
        </Modal>
    </div>
  );
}

import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import UploadLesson from "./Lesson/UploadLesson";
import LessonCard from "../components/LessonCard";
import { getTermName } from "../utils/getTermName";
import useUserStore from "../store/useUserStore";
import useClassStore from "../store/useClassStore";
import QuizCard from "../components/QuizCard";

export default function SelectedSubject() {
    
  const [isOpen, setIsOpen] = useState(false);
  const panelStyle = "w-full sm:h-[70%] max-w-lg rounded-xl shadow-xl"
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 10000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage]);

  const [materials, setMaterials] = useState([]);
  

  const [fetchMaterialsError, setFetchMaterialsError] = useState("");

  const [quiz, setQuiz] = useState([])
  
  const { classId, term } = useParams();
  const userRole = useUserStore((state) => state.userRole);
  const className = useClassStore((state) => state.className);

  const getLessons = async() => {
    try {
        const response = await axios.get(`http://localhost:8000/class_material/getByClassId/${classId}`)
        setMaterials(response.data)
        console.log(response.data)
    } catch(err) {
        if(err.response?.data?.detail) {
            setFetchMaterialsError(err.response.data.detail)
        } else {
            setFetchMaterialsError("Network Error")
         }
    } 
  }
 
  const getQuizzes = async() => {
    try{
      const response = await axios.get(`http://localhost:8000/getQuizzes/${classId}`)
      console.log(response.data);
      setQuiz(response.data);
    }
    catch(error){
      console.log("Error: ", error)
    }
  }  

  useEffect(() => {
    if(classId){
      getLessons();
      getQuizzes();
    }
    console.log("Class ID changed:", classId);
  }, [classId])


  const filteredMaterials = useMemo(() => {
    return materials.filter((lesson) => lesson.termId === Number(term)) 
  }, [materials, term])

 
  let termName = getTermName(Number(term));

  return (
    <div className="flex flex-col w-full h-full py-5 gap-5 items-center">
        <div
            className="
            flex flex-col
            w-3/4 sm:w-[80%]
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
                <p className="text-xl sm:text-2xl font-bold text-white" >{className}</p>
            </div>
            
        </div>

        <div className="flex flex-row w-3/4 sm:w-[80%] gap-5 mx-auto mt-4">
            {userRole == "teacher" && (
              <>
                <button 
                  onClick={() => setIsOpen(true)} 
                  className="w-1/2 sm:w-[15%] shadow-xl rounded p-2 text-white font-bold bg-[#102E50] 
                  hover:bg-[#F4F6FF] hover:text-[#102E50] transition-transform duration-300" 
                > 
                  Create + 
                </button>
                
                {successMessage && (<p className="text-green-800 self-end">{successMessage}</p>)}
              </>
            )}
        </div>

        <div className="w-4/5 sm:w-[80%] mt-10">
          <h2 className="text-[#F5C45E] font-bold text-2xl">{termName}'s Materials</h2>
        </div>
        
        <div className="flex flex-wrap justify-between w-3/4 sm:w-[80%]">
            <p className="text-red-800">{classId}</p>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((lesson) => (
              <LessonCard 
                key={lesson.id} 
                materialName={lesson.title} 
                materialId={lesson.id} 
                creationDate ={lesson.createdAt}
                materialType ={lesson.type}
                classId = {classId}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center w-full py-6">
              No lessons available for this term yet. {filteredMaterials[0]}
            </div>
          )}
        </div>
        
        <div className="w-3/4 sm:w-[80%] mt-10">
          <h2 className="text-[#F5C45E] font-bold text-2xl">{termName}'s Quizzes</h2>
        </div>

        <div className="flex flex-wrap justify-between w-3/4 sm:w-[80%]">
            <p className="text-red-800">{classId}</p>
          {materials.length > 0 && quiz.length > 0 ? (
            quiz.map((quiz) => {
              const lesson = materials.find((m) => m.id === quiz.lesson_id);
              const lessonTitle = lesson ? lesson.title : "Unknown Lesson";
              console.log(lessonTitle)
              return(
                <QuizCard 
                key={quiz.id} 
                quizId={quiz.id} 
                lessonTitle={lessonTitle}
                quizTitle={quiz.title} 
                createdAt={quiz.created_at}
              />
              )
            })
          ) : (
            <div className="text-gray-500 text-center w-full py-6">
              No Quiz available for this term yet
            </div>
          )}
        </div>


        
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload a Material" panelStyle={panelStyle}>
            <UploadLesson 
              setSuccessMessage={setSuccessMessage}
              setIsOpen={setIsOpen} 
              term={term}
              onSuccess={() => {
                getLessons();
                setIsOpen(false);
              }}
            />
        </Modal>

    </div>
  );
}
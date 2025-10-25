
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

  

  useEffect(() => {
    getLessons();
  } , [classId])


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
          
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <LessonCard 
                key={material.id} 
                materialName={material.title} 
                materialId={material.id} 
                creationDate ={material.createdAt}
                materialType ={material.type}
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
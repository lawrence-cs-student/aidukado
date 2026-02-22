import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "../services/axiosConfig";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import UploadLesson from "./Lesson/UploadLesson";
import LessonCard from "../components/LessonCard";
import { getTermName } from "../utils/getTermName";
import useUserStore from "../store/useUserStore";
import useClassStore from "../store/useClassStore";
import QuizCard from "../components/QuizCard";
import ExamCard from "../components/AIExam/ExamCard";
import { LuUpload } from "react-icons/lu";
import ClassicButton from "../components/classicButton";
import { PiKeyReturn, PiExport, PiUpload } from "react-icons/pi";
import UserDropup from "../components/DropUp/UserDropUp";
import { FaMagic } from "react-icons/fa";

export default function SelectedClass() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [materials, setMaterials] = useState([]);
  const [fetchMaterialsError, setFetchMaterialsError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [exams, setExams] = useState([]);

  const handleArchiveQuiz = async (quizId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/archiveQuiz/${quizId}`);
      alert("Quiz archived successfully!");
    } catch (error) {
      console.error("Failed to archive:", error);
      alert("Could not archive quiz. Please try again.");
    }
  };

  const handleArchiveExam = async (examId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/archiveExam/${examId}`);
      alert("Exam archived successfully!");
    } catch (error) {
      console.error("Failed to archive exam:", error);
      alert("Could not archive exam. Please try again.");
    }
  };
    
  const { classId, term } = useParams();
  const userRole = useUserStore((state) => state.userRole);
  const userId = useUserStore((state) => state.userId);
  const className = useClassStore((state) => state.className);

  const getLessons = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/class_material/getByClassId/${classId}`);
      setMaterials(response.data);
    } catch(err) {
      if(err.response?.data?.detail) {
        setFetchMaterialsError(err.response.data.detail);
      } else {
        setFetchMaterialsError("Network Error");
      }
    } 
  };

  const getQuizzes = async () => {
    try {
      let response;

      if (userRole === "teacher") {
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/getQuizzes/${classId}`,
          { params: { term } }
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/student/quizzes/${classId}`,
          {
            params: { term, student_id: userId },
          }
        );
      }

      setQuizzes(response.data);
      
    } catch (error) {
      console.log("Error fetching quizzes:", error);
    }
  };

  const getExams = async () => {
    try {
      let response;
      let examData;

      if (userRole === "teacher") {
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/exam/getExams/${classId}`,
          { 
            params: { 
              term_id: term,
              class_id: classId 
            } 
          }
        );
        examData = response.data || [];
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/exam/student/exams/${classId}`,
          {
            params: { 
              term_id: term, 
              student_id: userId 
            },
          }
        );
        examData = response.data || [];
      }

      setExams(examData);
    } catch (error) {
      console.log("Error fetching exams:", error);
      setExams([]);
    }
  };

  const location = useLocation();
  
  useEffect(() => {
    if (classId) {
      getLessons();
      getQuizzes();
      getExams(); 
    }

    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    
  }, [classId, term, location.state?.refresh]);

  console.log("QUIZZES:",quizzes)

  const filteredMaterials = useMemo(() => {
    return materials.filter((lesson) => lesson.termId === Number(term));
  }, [materials, term]);

  const handleGenerateExam = () => {
    navigate(`/exam/generate/${classId}/${term}`, {
      state: {
        lessons: filteredMaterials,
        term: term,
        className: className
      }
    });
  };

  let termName = getTermName(Number(term));
  const panelStyle = "w-full h-auto max-w-lg rounded-xl shadow-xl";

  // Group materials by type for cleaner rendering
  const materialsByType = useMemo(() => {
    const grouped = {
      lesson: [],
      activity: [],
      project: [],
      experiment: []
    };
    
    filteredMaterials.forEach(material => {
      if (grouped[material.type]) {
        grouped[material.type].push(material);
      }
    });
    
    return grouped;
  }, [filteredMaterials]);

  return (
    <div className="flex flex-col w-full h-auto min-h-screen py-8 gap-8 items-center relative">
      <UserDropup />
      
      <div
        className="flex flex items-center w-3/4 sm:w-[70%] min-h-[100px] lg:min-h-[120px] h-auto         
          truncate bg-[#102E50] rounded-2xl relative p-5"
      >
        <div className="absolute h-[8%] w-full bg-black/20 bottom-0 left-0"></div>
        <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white truncate">{className}</p>
      </div>

      {userRole === "teacher" && (
        <div className="flex flex-col md:flex-row w-3/4 sm:w-[70%] h-auto gap-2 mx-auto justify-end mt-3">
          
          <ClassicButton 
            buttonName="Upload Material"
            className="bg-[#102E50] shadow-md place-self-end w-full md:w-auto"
            onClick={() => setIsOpen(true)}
            mainColor="#183D65" 
            darkColor="#102E50"
            icon={PiUpload}
          />

          <ClassicButton 
            buttonName="Generate Exam"
            className="shadow-md place-self-end w-full md:w-auto"
            onClick={handleGenerateExam}
            mainColor="#E78B48" 
            darkColor="#B9652B"
            icon={FaMagic}
          />

          <ClassicButton 
            buttonName="Export Scores"
            className="shadow-md w-full md:w-auto"
            onClick={() => navigate(`/export-scores/${classId}/${term}`)}
            mainColor="#5C6BC0" 
            darkColor="#3949AB"
            icon={PiExport}
          />

        </div>
      )}

      {/* Materials Section */}
      <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
        <h2 className="text-[#E78B48] font-bold text-2xl place-self-center uppercase">{termName}</h2>
      </div>

      {/* Lesson Section - No scores */}
      {materialsByType.lesson.length > 0 && (
        <>
          <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
            <h2 className="text-[#102E50] font-bold text-2xl">Lessons</h2>
          </div>
          
          <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl">
            {materialsByType.lesson.map((lesson) => (
              <LessonCard 
                key={lesson.id} 
                materialName={lesson.title} 
                materialId={lesson.id} 
                creationDate={lesson.createdAt}
                materialType={lesson.type}
                classId={classId}
                // No totalScore for lessons
              />
            ))}
          </div>
        </>
      )}

      {/* Activity Section - Can have scores */}
      {materialsByType.activity.length > 0 && (
        <>
          <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
            <h2 className="text-[#102E50] font-bold text-2xl">Activities and Assignments</h2>
          </div>
          
          <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl">
            {materialsByType.activity.map((activity) => (
              <LessonCard 
                key={activity.id} 
                materialName={activity.title} 
                materialId={activity.id} 
                creationDate={activity.createdAt}
                materialType={activity.type}
                classId={classId}
                totalScore={activity.total_score} // Pass score for gradable materials
                status={activity.status} // Pass status if available
                dueDate={activity.due_date} // Pass due date if available
              />
            ))}
          </div>
        </>
      )}

      {/* Project Section - Can have scores */}
      {materialsByType.project.length > 0 && (
        <>
          <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
            <h2 className="text-[#102E50] font-bold text-2xl">Projects</h2>
          </div>
          
          <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl">
            {materialsByType.project.map((project) => (
              <LessonCard 
                key={project.id} 
                materialName={project.title} 
                materialId={project.id} 
                creationDate={project.createdAt}
                materialType={project.type}
                classId={classId}
                totalScore={project.total_score} // Pass score for gradable materials
                status={project.status} // Pass status if available
                dueDate={project.due_date} // Pass due date if available
              />
            ))}
          </div>
        </>
      )}

      {/* Experiment Section - Can have scores */}
      {materialsByType.experiment.length > 0 && (
        <>
          <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
            <h2 className="text-[#102E50] font-bold text-2xl">Experiments and Exercises</h2>
          </div>
          
          <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl">
            {materialsByType.experiment.map((experiment) => (
              <LessonCard 
                key={experiment.id} 
                materialName={experiment.title} 
                materialId={experiment.id} 
                creationDate={experiment.createdAt}
                materialType={experiment.type}
                classId={classId}
                totalScore={experiment.total_score} // Pass score for gradable materials
                status={experiment.status} // Pass status if available
                dueDate={experiment.due_date} // Pass due date if available
              />
            ))}
          </div>
        </>
      )}

      {/* Show message if no materials exist */}
      {filteredMaterials.length === 0 && (
        <div className="w-3/4 sm:w-[70%] mt-4 h-auto">
          <div className="text-gray-500 text-center w-full py-6">
            No materials available for this term yet.
          </div>
        </div>
      )}
      
      {/* Quizzes Section */}
      <div className="w-3/4 sm:w-[70%] mt-10">
        <h2 className="text-[#102E50] font-bold text-2xl">Assessments</h2>
      </div>

      <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl">
        {materials.length > 0 && quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            const lesson = materials.find((m) => m.id === quiz.lesson_id);
            const lessonTitle = lesson ? lesson.title : "Unknown Lesson";
            return (
              <QuizCard 
                key={quiz.id} 
                quizData={quiz}
                onArchive={handleArchiveQuiz} 
              />
            );
          })
        ) : (
          <div className="text-gray-500 text-center w-full py-6">
            No quizzes available for this term yet
          </div>
        )}
      </div>

      {/* Exams Section */}
      <div className="w-3/4 sm:w-[70%] mt-10">
        <h2 className="text-[#102E50] font-bold text-2xl">Exam</h2>
      </div>

      <div className="flex flex-wrap justify-start gap-5 w-3/4 sm:w-[70%] p-2 rounded-2xl mb-12">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <ExamCard 
              key={exam.id} 
              examData={exam}
              userRole={userRole}
              onArchive={userRole === "teacher" ? handleArchiveExam : undefined}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center w-full py-6">
            {userRole === "teacher" 
              ? "No exams available for this term yet." 
              : "No exams assigned to you for this term."
            }
          </div>
        )}
      </div>

      <div className="w-3/4 sm:w-[70%] h-auto place-items-center">
        <ClassicButton 
          buttonName="Back"
          icon={PiKeyReturn}
          onClick={() => navigate(-1)}
          className="absolute" 
          mainColor="#E78B48" 
          darkColor="#B9652B"
        />
      </div>

      {/* Modal for Upload Lesson */}
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
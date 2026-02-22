import axios from "../../services/axiosConfig";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AssignQuiz from '../../components/AssignQuiz/AssignQuiz';
import QuizForm from '../../components/AIQuiz/QuizForm';
import LoadingSpinner from '../../components/AIQuiz/LoadingSpinner';

export default function AIQuiz() {
  const { materialId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState(null);

  // Consolidated form state
  const [formData, setFormData] = useState({
    title: "",
    items: "",
    duration: "",
    instruction: "",
    question_type: "",
    assessment_type: "",
    error: "",
    opening_time: "",
    closing_time: "",
    
  });

  console.log(formData);
  // Validation helper
  const validateForm = () => {
    const { title, items, duration, question_type, assessment_type } = formData;

    if (!title.trim()) {
      return "Please enter a quiz title";
    }
    if (!items || items <= 0) {
      return "Please enter a valid number of items";
    }
    if (items > 30) {
      return "Maximum 30 questions allowed";
    }
    if (!duration || duration <= 0) {
      return "Please enter a valid duration";
    }
    if (duration > 60) {
      return "Maximum time is 60 mins"
    }
    if (!question_type) {
      return "Please select a question type";
    }
    if (!assessment_type) {
      return "Please select an assessment type";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setFormData(prev => ({ ...prev, error: validationError }));
      return;
    }

    setFormData(prev => ({ ...prev, error: "" }));
    setLoading(true);

    try {
      // Fetch lesson content
      const lessonResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/getLesson/${materialId}`
      );
      
      const lessonData = lessonResponse.data;
      setLessonId(lessonData.id);

      // Generate quiz
      const formDataToSend = new FormData();
      formDataToSend.append('lesson', lessonData.extracted_content);
      formDataToSend.append("items", formData.items);
      formDataToSend.append("question_type", formData.question_type);

      const quizResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/generateQuiz`, 
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const generatedQuestions = quizResponse.data.quiz;

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions were generated");
      }

      setQuestions(generatedQuestions);

    } catch (error) {
      console.error("Quiz generation error:", error);
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || "Failed to generate quiz. Please try again.";
      
      setFormData(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };
  

  // Render based on state
  return (
    <div className="h-auto min-h-screen w-full flex items-center bg-white p-4">
      {loading && <LoadingSpinner />}

      {!loading && questions.length === 0 && (
        <div className="w-full h-auto"> 
          <QuizForm 
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="w-full h-auto">
          <AssignQuiz 
            questions={questions} 
            title={formData.title} 
            total_points={formData.items} 
            lesson_id={lessonId} 
            instructions={formData.instruction} 
            duration={formData.duration} 
            assessment_type={formData.assessment_type}
            closing_time={formData.closing_time}
            opening_time={formData.opening_time}
          />
        </div>
      )}
    </div>
  );
}
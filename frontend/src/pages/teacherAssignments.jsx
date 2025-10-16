import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Test from "../components/teacherTest";
//import storePostTestLesson from "../store/storePostTestLesson";



export default function AITest() {

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState(2);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizItems, setQuizItems] = useState("");
  const [quizType, setQuizType] = useState("");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction] = useState("");
  const [startTime, setStartTime] = useState();
  const [duration, setDuration] = useState();

  const handleUpload = async () => {
    //display the timer on the page and edit and assign button 
    //check if role if teacher before proceeding 
    //get lesson base from lesosn id

    setLoading(true);

    try {

      const lessonResponse = await axios.get(`http://localhost:8000/getLesson/${lessonId}`);

      const formData = new FormData();
      formData.append('lesson', lessonResponse.data.lesson_content);
      formData.append("items", quizItems);
      formData.append("type", quizType);
 
    
      const quizResponse = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      setQuestions(quizResponse.data.pretest);

    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="bg-[#424874] h-full w-[100%] flex flex-col items-center justify-center p-6 ">
      {loading && (
        <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white text-xl font-semibold animate-pulse"> Generating Quiz... Please Wait</div>
        </div>
      )}

      {!loading && questions.length === 0 &&(
        <>
        <div className="max-w-md w-full mt-10 p-6 bg-white rounded-2xl shadow-lg overflow-y-auto max-h-[80vh]">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI-Quiz Generation</h1>
          <p className="text-gray-500 italic mb-6"></p>

          <label> Title: </label>
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            type="text"
            placeholder="Enter Title"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label> Number of items: </label>
          <input
            value={quizItems}
            onChange={(e) => setQuizItems(e.target.value)}
            type="text"
            placeholder="Enter Number of Items"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label> Set start time: </label>
          <input
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            type="datetime-local"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label> Set Quiz Duration:  </label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            placeholder="Set quiz timer"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label> Description: </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Enter Description"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label> Instruction: </label>
          <input
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            type="text"
            placeholder="Enter Instruction"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block mb-2 font-medium text-gray-700">Choose Quiz Type:</label>
          <select
            value={quizType}
            onChange={(e) => setQuizType(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select Quiz Type</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True or False</option>
          </select>

          <button
            className="w-full py-3 bg-[#333446] text-white font-bold rounded-lg hover:bg-gray-700 transition"
            onClick={handleUpload}
          >
            Generate Quiz
          </button>
        </div>
        </>
      )}

      {!loading && questions.length > 0 && (
        <div>
          <Test questions={questions} title={quizTitle} total_points={quizItems} lesson_id={lessonId} description={description} instruction={instruction} duration={duration} start_time={startTime} />
        </div>
      )}

    </div>
  )
   
}
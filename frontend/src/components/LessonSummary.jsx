import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

export default function Summary() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const {lessonId} = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {

        const response = await axios.post(`http://localhost:8000/class_material/getSummary/${lessonId}`);
        setSummary(response.data.summary);

      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary("Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [lessonId]);

  const handleClick = () => {
    navigate(`/selectedLesson/${lessonId}`)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Lesson Summary
        </h1>

        {loading ? (
          <p className="text-gray-500 italic">Generating summary...</p>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

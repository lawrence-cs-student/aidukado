import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Summary() {
  const [lessonId, setLessonId] = useState(2);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const lesson = await axios.get(`http://localhost:8000/getLesson/${lessonId}`);

        const response = await axios.post(
          "http://localhost:8000/getSummary",
          lesson.data.lesson_content,
          { headers: { "Content-Type": "text/plain" } }
        );

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
            onClick={() => setLessonId((prev) => prev + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

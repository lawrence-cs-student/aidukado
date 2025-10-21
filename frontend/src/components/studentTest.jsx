import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

export default function StudentTest() {
  const navigate = useNavigate();
  const student_id = useUserStore((state) => state.userId);

  const [quiz, setQuiz] = useState({ quiz_content: [] });
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const [lessonId, setLessonId] = useState(2);

  // Fetch quiz and calculate remaining time
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/getQuiz/${lessonId}`);
        setQuiz(res.data);

        const startTime = new Date(res.data.start_time);
        const durationMinutes = res.data.duration || 10; // fallback 10 minutes
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const remaining = Math.max(0, endTime - new Date());
        setTimeLeft(remaining);

        // Auto-submit immediately if time is already up
        if (remaining <= 0) {
          handleSubmit(true, res.data.quiz_content);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  // Countdown timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          handleSubmit(true); // auto-submit
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted, timeLeft]);

  const handleOptionChange = (qIndex, selectedText) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: selectedText,
    }));
  };

  const handleSubmit = async (auto = false, quizContent = quiz.quiz_content) => {
    let totalScore = 0;

    quizContent.forEach((q, index) => {
      const correctAnswer = q.answer?.trim();
      const studentAnswer = userAnswers[index] || ""; // empty string counts as wrong
      if (studentAnswer === correctAnswer) totalScore++;
    });

    setScore(totalScore);
    setSubmitted(true);

    try {
      await axios.post("http://localhost:8000/saveScore", {
        student_id,
        test_type: quiz.title,
        test_id: quiz.id,
        score: totalScore,
        auto_submit: auto,
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-xl p-8 sm:p-10 overflow-y-auto max-h-[90vh]">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {quiz.title || "Lesson Quiz"}
        </h1>

        <p className="font-semibold mb-4 text-center">
          Time left: ⏱ {formatTime(timeLeft)}
        </p>

        {quiz.quiz_content.length === 0 && <p>No questions available.</p>}

        {quiz.quiz_content.map((q, index) => {
          const studentAnswer = userAnswers[index] || "";
          const isCorrect = submitted && studentAnswer === q.answer;

          return (
            <div
              key={index}
              className="mb-8 p-4 border border-gray-200 rounded-xl bg-[#F9FAFB]"
            >
              {q.question && <p className="font-semibold text-lg mb-3">{q.question}</p>}
              {q.questionImage && (
                <img src={q.questionImage} alt="Question" className="max-w-xs rounded-lg mb-3 border" />
              )}

              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex flex-col sm:flex-row items-start sm:items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt.text}
                        checked={studentAnswer === opt.text}
                        onChange={() => handleOptionChange(index, opt.text)}
                        disabled={submitted}
                        className="accent-[#424874]"
                      />
                      <div className="flex flex-col items-start gap-1">
                        {opt.text && <span>{opt.text}</span>} 
                        {opt.image && (
                          <img src={opt.image} alt="Option" className="max-w-[150px] mt-2 sm:mt-0 rounded border" />
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              {submitted && (
                <div className="mt-2">
                  {isCorrect ? (
                    <p className="text-green-600 font-medium">✅ Correct!</p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ❌ Incorrect. Correct Answer: {q.answer}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!submitted && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handleSubmit(false)}
              className="px-8 py-3 bg-[#424874] text-white font-semibold rounded-lg hover:bg-[#2f355d] transition"
            >
              Submit Answers
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-8 text-center space-y-4">
            <p className="text-3xl font-bold text-[#424874]">
              Score: {score} / {quiz.quiz_content.length}
            </p>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/selectedLesson")}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import useUserStore from "../store/useUserStore";

export default function StudentTest() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({ quiz_content: [] });
  const [lessonId, setLessonId] = useState(2);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const student_id = useUserStore((state) => state.userId);

  const questionPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastQuestion = currentPage * questionPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionPerPage;

  const currentQuestions = quiz?.quiz_content?.slice(indexOfFirstQuestion, indexOfLastQuestion) || [];
  const totalPages = Math.ceil((quiz?.quiz_content?.length || 0) / questionPerPage);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get( `http://localhost:8000/getQuiz/${lessonId}`);
        setQuiz(response.data);

      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const getOption = (optionString) => optionString.trim().charAt(0).toUpperCase();

  const handleOptionChange = (question, selectedOptionText) => {
    const selectedOption = getOption(selectedOptionText);
    setUserAnswers((prev) => ({
      ...prev,
      [question]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    let unAnsweredQuestions = 0;

    quiz.quiz_content.forEach((q, index) => {
      const correctAnswer = q.answer?.trim().toUpperCase();
      const currentUserAnswer = userAnswers[index]?.trim().toUpperCase() || null;

      if (currentUserAnswer === null) unAnsweredQuestions++;
      if (currentUserAnswer === correctAnswer) totalScore++;
    });

    if (unAnsweredQuestions > 0) {
      alert("Please answer all questions before submitting");
    } else {
      setScore(totalScore);
      setSubmitted(true);
    }

    try{
        const score = {
            student_id,
            test_type: quiz.title,
            test_id: 1,
            score: totalScore
        } 
        console.log(score);
        const response = await axios.post("http://localhost:8000/saveScore", score, {
            headers: {
                "Content-Type" : "application/json",
            },
        })
    }catch (error){
        console.log('Error: ', error)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-xl p-8 sm:p-10 overflow-y-auto max-h-[90vh]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#333446] mb-6 text-center">
          {quiz.title || "Lesson Quiz"}
        </h1>

        {currentQuestions.length > 0 ? (
          currentQuestions.map((q, index) => {
            const questionIdentifier = indexOfFirstQuestion + index;
            const correctAnswer = q.answer?.trim().toUpperCase();
            const currentUserAnswer = userAnswers[questionIdentifier]?.trim().toUpperCase() || null;

            return (
              <div
                key={questionIdentifier}
                className="mb-8 p-4 border border-gray-200 rounded-xl bg-[#F9FAFB]"
              >
                <p className="font-semibold text-lg mb-3">{q.question}</p>

                <ul className="space-y-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${questionIdentifier}`}
                          value={opt}
                          onChange={() =>
                            handleOptionChange(questionIdentifier, opt)
                          }
                          checked={currentUserAnswer === getOption(opt)}
                          disabled={submitted}
                          className="accent-[#424874]"
                        />
                        <span className="text-gray-800">{opt}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                {submitted && (
                  <div className="mt-2">
                    {currentUserAnswer === correctAnswer ? (
                      <p className="text-green-600 font-medium">✅ Correct!</p>
                    ) : (
                      <p className="text-red-600 font-medium">
                        ❌ Incorrect. Correct Answer:{" "}
                        <span className="font-semibold">
                          {q.options.find(
                            (opt) => getOption(opt) === correctAnswer
                          ) || "N/A"}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-center">No questions found.</p>
        )}

        {quiz.quiz_content.length > questionPerPage && !submitted && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
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

        {!submitted && currentPage === totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#424874] text-white font-semibold rounded-lg hover:bg-[#2f355d] transition"
            >
              Submit Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

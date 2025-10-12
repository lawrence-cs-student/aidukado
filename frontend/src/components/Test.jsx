import React, { useState, useEffect } from "react";
import storeIncorrectAnswers from "../store/storeIncorrectAnswers";
import { useNavigate } from "react-router-dom"
import Pagination from "../components/Pagination";
import { MdEdit } from "react-icons/md";
import useUserStore from "../store/useUserStore";

// 🧠 Main component
export default function PretestQuestions({ lesson_id }) {

  const navigate = useNavigate();

  const setIncorrectAnswers = storeIncorrectAnswers((state) => state.setIncorrectAnswers);

  const userRole = useUserStore((state) => state.userRole);

  const [userAnswers, setUserAnswers] = useState({});


  const [submitted, setSubmitted] = useState(false);


  const [score, setScore] = useState(0);

  //For Pagination
  const questionPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastQuestion = currentPage * questionPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionPerPage;
  
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const totalPages = Math.ceil(questions.length / questionPerPage);

  useEffect 

  // 🔠 Utility: extract and clean the answer letter from option string, e.g., "A. Apple" → "A"
  const getOption = (optionString) => {
    return optionString.trim().charAt(0).toUpperCase();
  };

  // 🖱️ Called when user selects an option for a question
  const handleOptionChange = (question, selectedOptionText) => {
    const selectedOption = getOption(selectedOptionText); // extract the "A"/"B"/etc
    setUserAnswers((prev) => ({
      ...prev,
      [question]: selectedOption, // updates the specific question's answer
    }));
  };

  // 📤 Called when user clicks the "Submit Answers" button
  const handleSubmit = async () => {
    const IncorrectAnswers = [];         // collect wrong answers for later use
    let totalScore = 0;                  // count of correct answers
    let unAnsweredQuestions = 0;         // detect if anything was left unanswered

    // 🔁 Go through each question and check user's answer
    questions.forEach((q, index) => { 
      const questionIdentifier = q.question || index;

      const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null;
      const currentUserAnswer = userAnswers[questionIdentifier]? userAnswers[questionIdentifier].trim().toUpperCase(): null;

      // ❗ If no answer was selected
      if (currentUserAnswer === null) {
        unAnsweredQuestions += 1;
      } 
      // ❌ If the answer is incorrect
      else if (currentUserAnswer !== correctAnswer) {
        IncorrectAnswers.push({
          question: q.question,   
          options : q.options,
          answer: correctAnswer,
          user_answer: currentUserAnswer
          
        });
      } 
      // ✅ Correct answer
      else {
        totalScore += 1;
      }
    });

    // ⛔ Don't allow submission if any question is left blank
    if (unAnsweredQuestions > 0){
      alert("Please answer all questions before submitting");
    } else {
      setScore(totalScore);  // save the score
      setSubmitted(true);    // lock the quiz and show results

      setIncorrectAnswers(IncorrectAnswers);
    }
  };

  const handleClick = () => {
    navigate('/lesson')
  }

return (
  <div className="flex justify-center items-center min-h-screen p-4">
    <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-xl p-8 sm:p-10 overflow-y-auto max-h-[90vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#333446] mb-6 text-center">
        {title}
      </h1>
      
      {/* 📋 Questions Section */}
      {currentQuestions.length > 0 ? (
        currentQuestions.map((q, index) => {
          const questionIdentifier = q.question || index;
          const correctAnswer = q.answer
            ? q.answer.trim().toUpperCase()
            : null;
          const currentUserAnswer = userAnswers[questionIdentifier]
            ? userAnswers[questionIdentifier].trim().toUpperCase()
            : null;

          return (
            <div
              key={questionIdentifier}
              className="mb-8 p-4 border border-gray-200 rounded-xl bg-[#F9FAFB]"
            >
              <p className="font-semibold text-lg mb-3">{q.question}</p>

              {/* 🔘 Options */}
              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${questionIdentifier}`}
                        value={opt}
                        onChange={() => handleOptionChange(questionIdentifier, opt)}
                        checked={currentUserAnswer === getOption(opt)}
                        disabled={submitted}
                        className="accent-[#424874]"
                      />
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
              

              {/* ✅❌ Feedback */}
              {submitted && (
                <div className="mt-2">
                  {currentUserAnswer === correctAnswer ? (
                    <p className="text-green-600 font-medium">✅ Correct!</p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ❌ Incorrect. Correct Answer:{" "}
                      <span className="font-semibold">
                        {q.options.find((opt) => getOption(opt) === correctAnswer) ||
                          "N/A"}
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

      {/* 📄 Pagination */}
      {questions.length > questionPerPage && !submitted && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}


      {/* 🎯 After Submission */}
      {submitted && (
        <div className="mt-8 text-center space-y-4">
          <p className="text-3xl font-bold text-[#424874]">
            Score: {score} / {questions.length}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleClick}
            >
              Learn
            </button>
            
          </div>
        </div>
      )}

      {/* 📤 Submit Button */}
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






 
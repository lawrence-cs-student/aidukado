import React, { useState } from "react";
import storeIncorrectAnswers from "../store/storeIncorrectAnswers";
import { useNavigate } from "react-router-dom"

// 🧠 Main component
export default function PretestQuestions({ questions = [], title }) {

  const navigate = useNavigate();

  const setIncorrectAnswers = storeIncorrectAnswers((state) => state.setIncorrectAnswers)


  const [userAnswers, setUserAnswers] = useState({});


  const [submitted, setSubmitted] = useState(false);


  const [score, setScore] = useState(0);

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
    <div className="absolute top-0 left-[15%] w-[85%] h-screen overflow-y-auto p-6 bg-[#333446] text-white">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* 📋 Loop through each question */}
      {questions.length > 0 ? (
        questions.map((q, index) => { 
          const questionIdentifier = q.question || index;

          const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null;
          const currentUserAnswer = userAnswers[questionIdentifier]
            ? userAnswers[questionIdentifier].trim().toUpperCase()
            : null;

          return (
            <div key={questionIdentifier} className="mb-6 text-white">
              <p className="font-semibold">{q.question}</p>

              {/* 🔘 Radio buttons for each option */}
              <ul className="ml-4">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${questionIdentifier}`}  // group by question
                        value={opt}
                        onChange={() => handleOptionChange(questionIdentifier, opt)}
                        checked={currentUserAnswer === getOption(opt)} // pre-fill if selected
                        disabled={submitted}  // disable after submission
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {/* ✅❌ Show result after submitting */}
              {submitted && (
                <div className="mt-1">
                  {currentUserAnswer === correctAnswer ? (
                    <p className="text-green-600">✅ Correct!</p>
                  ) : (
                    <p className="text-red-600">
                      ❌ Incorrect. Correct Answer:{" "}
                      <span className="font-semibold">
                        {
                          q.options.find(
                            (opt) => getOption(opt) === correctAnswer
                          ) || 'N/A'
                        }
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No questions found.</p>
      )}

      {/* 📤 Submit Button (only shows before submission) */}
      {!submitted && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Answers
        </button>
      )}
      
      {/* 🎯 Show Score after submission */}
      {submitted && (
        <div className="mt-4">
          <p className="font-bold text-green-600 text-4xl">score: {score}</p>
          <button className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleClick}>Learn</button>
        </div>
      )}
    </div>
  );
}

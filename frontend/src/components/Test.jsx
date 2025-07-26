import React, { useState } from "react";
import axios from 'axios'; 

export default function Test({ questions = [], onDataSend }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [incorrectAnswersData, setIncorrectAnswersData] = useState([]);


  const sendData = () => {
    const mistakes = incorrectAnswersData
    onDataSend(mistakes)
  }

  
  const getOption = (optionString) => {
    return optionString.trim().charAt(0).toUpperCase();
  };

  const handleOptionChange = (questionNumber, selectedOptionText) => {
    const selectedOption = getOption(selectedOptionText);
    setUserAnswers((prev) => ({
      ...prev,
      [questionNumber]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true); 

    const IncorrectAnswers = [];

    questions.forEach((q, index) => {
      const questionIdentifier = q.questionNumber || index;
      const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null;
      const currentUserAnswer = userAnswers[questionIdentifier] ? userAnswers[questionIdentifier].trim().toUpperCase(): null;

      if (currentUserAnswer !== correctAnswer) {
        IncorrectAnswers.push({
          question: q.question,
          userAnswer: currentUserAnswer,
          correctAnswer: correctAnswer,
          userAnswerText: q.options.find(
            (opt) => getOption(opt) === currentUserAnswer
          ),
          correctAnswerText: q.options.find(
            (opt) => getOption(opt) === correctAnswer
          ) || 'N/A'
        });
      }
    });

    setIncorrectAnswersData(IncorrectAnswers); 

    if (IncorrectAnswers.length > 0) {
      try {
        const response = await axios.post('http://localhost:8000/question_model/', { incorrectAnswers: IncorrectAnswers } 
        );

        if (response.status >= 200 && response.status < 300) {
          console.log("Incorrect answers sent successfully to backend!");
          console.log("Backend response data:", response.data);
        } else {
          console.error("Failed to send incorrect answers to backend. Status:", response.status);
          console.error("Backend error data:", response.data);
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
        if (error.response) {
          console.error("Server responded with error:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    }
  };

  return (
    <div className="bg-white overflow-auto h-2/4 w-3/4">
      <h1 className="text-2xl font-bold mb-4">Pretest Questions</h1>
      {questions.length > 0 ? (
        questions.map((q, index) => {
          const questionIdentifier = q.questionNUmber || index;

          const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null;

          const currentUserAnswer = userAnswers[questionIdentifier] ? userAnswers[questionIdentifier].trim().toUpperCase() : null;

          return (
            <div key={questionIdentifier} className="mb-6 text-black">
              <p className="font-semibold">{q.question}</p>
              <ul className="ml-4">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${questionIdentifier}`} 
                        value={opt} 
                        checked={currentUserAnswer === getOption(opt)}
                        onChange={() => handleOptionChange(questionIdentifier, opt)}
                        disabled={submitted}
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {submitted && (
                <div className="mt-1">
                  {currentUserAnswer === correctAnswer ? (
                    <p className="text-green-600">✅ Correct!</p>
                  ) : (
                    <p className="text-red-600">
                      ❌ Incorrect. Correct Answer:{" "}
                      <span className="font-semibold">
                        {q.options.find(
                          (opt) => getOption(opt) === correctAnswer
                        ) || 'N/A'}
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

      {!submitted && questions.length > 0 && (
        <button
          onClick={() => {handleSubmit(); sendData();}}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
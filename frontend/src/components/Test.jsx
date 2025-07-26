import React, { useState } from "react";
import axios from 'axios'; 

<<<<<<< HEAD:frontend/src/components/Test.jsx
export default function Test({ questions = [], onDataSend }) {
=======
export default function PretestQuestions({ questions = [], title }) {
>>>>>>> co-user-branch:frontend/src/tests/pretest.jsx
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);


  const sendData = () => {
    const mistakes = incorrectAnswersData
    onDataSend(mistakes)
  }

  
  const getOption = (optionString) => {
    return optionString.trim().charAt(0).toUpperCase();
  }; // clean option and get only the first letter 

  const handleOptionChange = (question, selectedOptionText) => {
    const selectedOption = getOption(selectedOptionText);
    setUserAnswers((prev) => ({
      ...prev,
      [question]: selectedOption,
    }));
  }; //return user answer to a question ex. B

  const handleSubmit = async () => {

    const IncorrectAnswers = [];
    let totalScore = 0;
    let unAnsweredQuestions = 0; 

    questions.forEach((q, index) => { 
      const questionIdentifier = q.question || index;
      const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null;
      const currentUserAnswer = userAnswers[questionIdentifier] ? userAnswers[questionIdentifier].trim().toUpperCase(): null;

      if (currentUserAnswer === null) {
        unAnsweredQuestions = unAnsweredQuestions + 1
      } else if(currentUserAnswer !== correctAnswer){
          IncorrectAnswers.push({
          question: q.question,   
          options : q.options,
          userAnswer: currentUserAnswer,
          correctAnswer: correctAnswer
        });
      } else{
        totalScore += 1
      }
    });

    if (unAnsweredQuestions > 0){
      alert("Please answer all questions before submitting")
    } else{

    setScore(totalScore)
    setSubmitted(true);

    // sends data to the backend where the user answers incorrect
    if (IncorrectAnswers.length > 0) {
      try {
        const response = await axios.post('http://localhost:8000/question_model', {IncorrectAnswers } 
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
    }
  };

  return (
    <div className="bg-white overflow-auto h-2/4 w-3/4">
      <h1 className="text-2xl font-bold mb-4">Pretest Questions</h1>
      {questions.length > 0 ? (
        questions.map((q, index) => { 
          const questionIdentifier = q.question || index; 

          const correctAnswer = q.answer ? q.answer.trim().toUpperCase() : null ;

          const currentUserAnswer = userAnswers[questionIdentifier] ? userAnswers[questionIdentifier].trim().toUpperCase() : null; //if-else users answer 

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
                        onChange={() => handleOptionChange(questionIdentifier, opt)}
                        checked={currentUserAnswer === getOption(opt)} 
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
      
      {submitted && (
        <div className="mt-4">
          <p className="font-bold text-green-600 text-4xl">score: {score}</p>
        </div>
      )}
    </div>
  );
}
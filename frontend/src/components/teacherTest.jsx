import React, { useState, useEffect } from "react";
import axios from 'axios';

// Save to database the lesson id, qid, question-correct-answer
export default function Questions({ questions = [], title, total_points, lesson_id, description, instruction }) {
  const [answer, setAnswer] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState(questions);

  // Set editable questions whenever new ones arrive
  useEffect(() => {
    setEditableQuestion(questions);
  }, [questions]);

  // ✅ Initialize correct answers (only once when questions change)
  useEffect(() => {
    const initialAnswers = {};
    questions.forEach((q) => {
      if (q.answer) initialAnswers[q.question] = q.answer;
    });
    setAnswer(initialAnswers);
  }, [questions]);

  const handleOptionChange = (question, selectedOptionText) => {
    setAnswer((prev) => ({
      ...prev,
      [question]: selectedOptionText,
    }));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...editableQuestion];
    updated[index].question = value;
    setEditableQuestion(updated);
  };

  const handleOptionTextChange = (qIndex, oIndex, value) => {
    const updated = [...editableQuestion];
    updated[qIndex].options[oIndex] = value;
    setEditableQuestion(updated);
  };

  const handleAssign = async () => {
    try{
        const quizData = {
            lesson_id,
            title,
            description,
            total_points,
            instruction,
            quiz_content: editableQuestion,

        };
        console.log(quizData);
        const saveQuiz = await axios.post("http://localhost:8000/assignQuiz", quizData, {
            headers: {
                "Content-Type" : "application/json",
            },
        })
        alert(saveQuiz.data.message);
    } catch(error){
        console.error("Saving Error: ", error)
    }  
  }

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex justify-center  items-start min-h-screen overflow-y-auto">
      <div className="w-full text-white rounded-2xl p-6 sm:p-10 max-h-[90vh]">
        <div className="flex justify-end gap-3">
          <button
            onClick={toggleEdit}
            className="text-[#333446] bg-white px-4 py-2 rounded-md hover:bg-gray-200"
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          <button onClick={handleAssign} className="text-[#333446]">Assign</button>
        </div>

        <div className="text-2xl sm:text-3xl font-bold text-[#333446] mb-6 text-center">
          <p className="text-white">{title}</p>
        </div>

        {editableQuestion.map((q, index) => {
          const questionIdentifier = q.question || index;

          return (
            <div
              key={index}
              className="mb-8 p-4 border border-gray-200 rounded-xl "
            >
              {isEditing ? (
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, e.target.value)
                  }
                  className="w-full max-w-12xl text-lg p-3 mb-4 rounded bg-gray-100 text-black font-semibold min-h-[48px]"
                />
              ) : (
                <p className="font-semibold text-lg mb-3">{q.question}</p>
              )}

              <ul className="space-y-2 text-white">
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
                        className="accent-[#424874]"
                      />
                      {isEditing ? (
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionTextChange(index, i, e.target.value)
                          }
                          className="text-black bg-gray-100 w-full rounded px-2 py-1 min-h-[32px]"
                        />
                      ) : (
                        <span>{opt}</span>
                      )}
                    </label>
                  </li>
                ))}
                <p>
                  ✅ Correct Answer:{" "}
                  {answer[questionIdentifier] || q.answer || "N/A"}
                </p>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

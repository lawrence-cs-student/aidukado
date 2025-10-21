import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Questions({
  questions = [],
  title,
  total_points,
  lesson_id,
  description,
  instruction,
  duration,
  start_time,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState([]);

  useEffect(() => {
    // Normalize structure (ensures options are always objects)
    const normalized = questions.map((q) => ({
      ...q,
      options: q.options.map((opt) =>
        typeof opt === "string" ? { text: opt, image: null } : opt
      ),
      questionImage: q.questionImage || null,
    }));
    setEditableQuestion(normalized);
  }, [questions]);

  // Converts uploaded file to base64 for preview and storage
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...editableQuestion];
    updated[index].question = value;
    setEditableQuestion(updated);
  };

  const handleOptionTextChange = (qIndex, oIndex, value) => {
    const updated = [...editableQuestion];
    updated[qIndex].options[oIndex].text = value;
    setEditableQuestion(updated);
  };

  const handleQuestionImageUpload = (index, file) => {
    convertToBase64(file, (base64) => {
      const updated = [...editableQuestion];
      updated[index].questionImage = base64;
      setEditableQuestion(updated);
    });
  };

  const handleOptionImageUpload = (qIndex, oIndex, file) => {
    convertToBase64(file, (base64) => {
      const updated = [...editableQuestion];
      updated[qIndex].options[oIndex].image = base64;
      setEditableQuestion(updated);
    });
  };

  const handleAssign = async () => {
    try {
      const quizData = {
        lesson_id,
        title,
        description,
        total_points,
        instruction,
        quiz_content: editableQuestion,
        start_time,
        duration,
      };
      console.log(quizData);

      const saveQuiz = await axios.post("http://localhost:8000/assignQuiz", quizData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(saveQuiz.data.message);
    } catch (error) {
      console.error("Saving Error: ", error);
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-start min-h-screen overflow-y-auto">
      <div className="w-full text-white rounded-2xl p-6 sm:p-10 max-h-[90vh]">
        <div className="flex justify-end gap-3">
          <button
            onClick={toggleEdit}
            className="text-[#333446] bg-white px-4 py-2 rounded-md hover:bg-gray-200"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button onClick={handleAssign} className="text-[#333446]">
            Assign
          </button>
        </div>

        <div className="text-2xl sm:text-3xl font-bold text-[#333446] mb-6 text-center">
          <p className="text-white">{title}</p>
        </div>

        {editableQuestion.map((q, index) => (
          <div
            key={index}
            className="mb-8 p-4 border border-gray-200 rounded-xl bg-[#424874]"
          >
            {/* Question text + image */}
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full text-lg p-3 mb-4 rounded bg-gray-100 text-black font-semibold"
                  placeholder="Enter question"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleQuestionImageUpload(index, e.target.files[0])
                  }
                  className="mb-2"
                />
                {q.questionImage && (
                  <img
                    src={q.questionImage}
                    alt="Question"
                    className="max-w-xs rounded-lg mb-3 border"
                  />
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-lg mb-3">{q.question}</p>
                {q.questionImage && (
                  <img
                    src={q.questionImage}
                    alt="Question"
                    className="max-w-xs rounded-lg mb-3 border"
                  />
                )}
              </>
            )}

            {/* Options */}
            <ul className="space-y-2 text-white">
              {q.options.map((opt, i) => (
                <li key={i}>
                  <label className="flex flex-col sm:flex-row items-start sm:items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt.text}
                      checked={q.answer === opt.text}
                      onChange={() => {
                        if (isEditing) {
                          const updated = [...editableQuestion];
                          updated[index].answer = opt.text;
                          setEditableQuestion(updated);
                        }
                      }}
                      className="accent-[#424874]"
                      disabled={!isEditing}
                    />
                    {isEditing ? (
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) =>
                            handleOptionTextChange(index, i, e.target.value)
                          }
                          className="text-black bg-gray-100 rounded px-2 py-1 mb-1"
                          placeholder="Option text"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleOptionImageUpload(
                              index,
                              i,
                              e.target.files[0]
                            )
                          }
                        />
                        {opt.image && (
                          <img
                            src={opt.image}
                            alt="Option"
                            className="max-w-[150px] mt-2 rounded border"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <span>{opt.text}</span>
                        {opt.image && (
                          <img
                            src={opt.image}
                            alt="Option"
                            className="max-w-[150px] mt-2 rounded border"
                          />
                        )}
                      </div>
                    )}
                  </label>
                </li>
              ))}
              <p>
                ✅ Correct Answer:{" "}
                <span className="font-semibold">{q.answer || "N/A"}</span>
              </p>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

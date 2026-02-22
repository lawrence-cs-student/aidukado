import { useState, useEffect, useMemo } from "react";
import axios from "../../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import ExamQuestionEditor from "./ExamQuestionEditor";
import StudentSelectModal from "./StudentSelectModal";
import { 
  FiSave, 
  FiEdit, 
  FiUserPlus, 
  FiPrinter, 
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiClock,
  FiBook,
  FiUsers,
  FiBarChart2
} from "react-icons/fi";
import ClassicButton from "../classicButton";

export default function AssignExam({ 
  questions = [], 
  title = "", 
  instructions = "", 
  duration = 60,
  lesson_ids = [],
  total_items = 0,
  classId = "",
  termId = "",
  closing_time = "", // ADDED: Closing time prop
  opening_time = "",
  onReset = () => {}
}) {
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState([]);
  const [showStudentSelect, setShowStudentSelect] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const class_id = classId;
  const term_id = termId;

  const optionLetters = useMemo(() => ["A", "B", "C", "D"], []);

  // Strip prefixes from question and option text
  const stripQuestionPrefix = (text) => {
    if (!text) return "";
    return text.replace(/^\d+[\s.)-]+\s*/, "");
  };

  const stripOptionPrefix = (text) => {
    if (!text) return "";
    return text.replace(/^[A-Da-d][\s.)-]+\s*/, "");
  };

  useEffect(() => {
    if (!class_id) {
      setError("Class ID is required");
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getStudentsByClass/${class_id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students. Please try again.");
      }
    };

    fetchStudents();
  }, [class_id]);

  /* =========================
     Normalize Questions
  ========================== */
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setEditableQuestions([]);
      return;
    }

    const normalized = questions.map((q, index) => {
      const cleanQuestion = stripQuestionPrefix(q.question || `Question ${index + 1}`);
      
      const rawOptions = Array.isArray(q.options) ? q.options : [];
      const options = rawOptions.map((opt, optIndex) => {
        const text = typeof opt === 'string' 
          ? stripOptionPrefix(opt) 
          : stripOptionPrefix(opt?.text || `Option ${optionLetters[optIndex]}`);
        
        return {
          text: text || `Option ${optionLetters[optIndex]}`,
          image: opt?.image || null
        };
      });
      
      while (options.length < 2) {
        options.push({
          text: `Option ${optionLetters[options.length]}`,
          image: null
        });
      }
      
      const finalOptions = options.slice(0, 4);
      
      // Validate answer
      let answer = q.answer || "A";
      if (!["A", "B", "C", "D"].includes(answer.toUpperCase())) {
        answer = "A";
      }
      
      return {
        id: `q-${index}-${Date.now()}`,
        question: cleanQuestion,
        options: finalOptions,
        answer: answer.toUpperCase(),
        questionImage: q.questionImage || null,
        points: parseInt(q.points, 10) || 1,
        lesson_id: parseInt(q.lesson_id, 10) || (lesson_ids[0] || 0),
      };
    });

    setEditableQuestions(normalized);
    setError(""); 
  }, [questions, lesson_ids, optionLetters]);

  /* =========================
     Handlers
  ========================== */
  const handleQuestionUpdate = (index, updatedQuestion) => {
    const updated = [...editableQuestions];
    updated[index] = {
      ...updatedQuestion,
      id: updatedQuestion.id || `q-${index}-${Date.now()}`
    };
    setEditableQuestions(updated);
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (students.length === 0) return;
    
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id || s._id));
    }
  };

  /* =========================
     Calculate Total Points
  ========================== */
  const totalPoints = useMemo(() => {
    return editableQuestions.reduce((sum, q) => sum + (q.points || 1), 0);
  }, [editableQuestions]);

  /* =========================
     Validate and Assign Exam
  ========================== */
  const validateExam = () => {
    if (!title || title.trim().length < 3) {
      return "Exam title must be at least 3 characters long";
    }
    
    if (editableQuestions.length === 0) {
      return "No questions in exam";
    }
    
    // Validate each question
    for (let i = 0; i < editableQuestions.length; i++) {
      const q = editableQuestions[i];
      
      if (!q.question || q.question.trim().length === 0) {
        return `Question ${i + 1} has no text`;
      }
      
      if (!q.options || q.options.length < 2) {
        return `Question ${i + 1} needs at least 2 options`;
      }
      
      const hasEmptyOptions = q.options.some(opt => !opt.text || opt.text.trim().length === 0);
      if (hasEmptyOptions) {
        return `Question ${i + 1} has empty options`;
      }
      
      if (!["A", "B", "C", "D"].includes(q.answer)) {
        return `Question ${i + 1} has invalid answer`;
      }
      
      if (q.points <= 0) {
        return `Question ${i + 1} must have positive points`;
      }
    }
    
    if (selectedStudents.length === 0) {
      return "Select at least one student";
    }

    if (!opening_time || opening_time.trim().length === 0) {
      return "Opening time is required";
    }
    
    // Validate closing_time
    if (!closing_time || closing_time.trim().length === 0) {
      return "Closing time is required";
    }
    
    try {
      const closingDate = new Date(closing_time);
      if (isNaN(closingDate.getTime())) {
        return "Invalid closing time format";
      }
      
      const now = new Date();
      if (closingDate < now) {
        return "Closing time must be in the future";
      }
    } catch (error) {
      return "Invalid closing time format";
    }
    
    return null;
  };

  const handleAssign = async () => {
    setError("");
    setSuccess("");
    
    const validationError = validateExam();
    if (validationError) {
      setError(validationError);
      return;
    }

    setAssigning(true);

    try {
      // Prepare exam_content properly
      const exam_content = {
        questions: editableQuestions.map((q, index) => ({
          number: index + 1,
          question: q.question.trim(),
          options: q.options.map(opt => opt.text.trim()),
          answer: q.answer,
          points: q.points || 1,
          lesson_id: q.lesson_id || lesson_ids[0] || 0,
        })),
        metadata: {
          total_questions: editableQuestions.length,
          total_points: totalPoints,
          generated_at: new Date().toISOString(),
          version: "1.0"
        }
      };

      // Calculate passing score (75% of total points)
      const passing_score = Math.round(totalPoints * 0.75);

      // Format closing_time correctly
      let formattedClosingTime = closing_time;
      if (closing_time && !closing_time.includes('T')) {
        // Convert to ISO format if needed
        const date = new Date(closing_time);
        if (!isNaN(date.getTime())) {
          formattedClosingTime = date.toISOString();
        }
      }

      let formattedOpeningTime = opening_time;
      if (opening_time && !opening_time.includes('T')) {
        // Convert to ISO format if needed
        const date = new Date(opening_time);
        if (!isNaN(date.getTime())) {
          formattedOpeningTime = date.toISOString();
        }
      }

      const payload = {
        title: title.trim(),
        total_points: totalPoints,
        instructions: (instructions || "Complete all questions carefully.").trim(),
        exam_content: exam_content,
        duration: parseInt(duration, 10) || 60,
        class_id: parseInt(class_id, 10),
        term_id: parseInt(term_id, 10),
        is_archive: false,
        passing_score: passing_score,
        shuffle_questions: false,
        assigned_students: selectedStudents.map(id => parseInt(id, 10)),
        class_material_ids: [],
        lesson_ids: lesson_ids.map(id => parseInt(id, 10)),
        closing_time: formattedClosingTime, // CRITICAL: Include closing_time
        opening_time: formattedOpeningTime
      };

      
      console.log("Assigning exam with payload:", JSON.stringify(payload, null, 2));
      console.log("Closing time being sent:", formattedClosingTime);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/exam/assignExam`,
        payload,
        { 
          headers: { 
            "Content-Type": "application/json" 
          },
          timeout: 30000
        }
      );

      console.log("Assign exam response:", response.data);
      
      setSuccess("Exam assigned successfully!");
      
      // Clear after 3 seconds and navigate
      setTimeout(() => {
        navigate(`/selectedClass/${class_id}/${term_id}`);
      }, 3000);

    } catch (err) {
      console.error("Assign exam error:", err);
      
      let errorMessage = "Failed to assign exam. Please try again.";
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        console.error("Error status:", err.response.status);
        
        if (err.response.data) {
          // Handle validation errors from FastAPI
          if (err.response.data.detail) {
            if (Array.isArray(err.response.data.detail)) {
              errorMessage = err.response.data.detail
                .map(e => e.msg || `${e.loc ? e.loc.join('.') : ''}: ${e.msg || 'Invalid'}`)
                .join(', ');
            } else {
              errorMessage = err.response.data.detail;
            }
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        
        errorMessage = `Error ${err.response.status}: ${errorMessage}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  /* =========================
     Print Exam
  ========================== */
  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) {
      setError("Popup blocked. Please allow popups to print.");
      return;
    }

    const answerKey = editableQuestions.map((q, i) => 
      `${i + 1}. ${q.answer}`
    ).join("<br>");

    const content = editableQuestions
      .map((q, i) => {
        const questionImageHtml = q.questionImage 
          ? `<div style="margin-bottom: 8px;">
              <img src="${q.questionImage}" alt="Question Image ${i + 1}" style="max-width: 100%; max-height: 200px; display: block; margin: 6px 0; border-radius: 4px; border: 1px solid #ddd;" />
             </div>`
          : '';

        const optionsHtml = q.options.map((o, idx) => {
          const optionImageHtml = o.image 
            ? `<div style="margin-top: 4px;">
                <img src="${o.image}" alt="Option ${optionLetters[idx]} Image" style="max-width: 150px; max-height: 100px; display: block; border-radius: 4px; border: 1px solid #eee;" />
               </div>`
            : '';
          
          return `
            <div style="margin: 6px 0;">
              <p style="margin: 0 0 4px 0; font-size: 13px; line-height: 1.3;">
                ${optionLetters[idx]}. ${o.text}
              </p>
              ${optionImageHtml}
            </div>
          `;
        }).join("");

        return `
          <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #ddd; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="flex: 1;">
                <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.4; font-weight: 600;">
                  ${i + 1}. ${q.question}
                </p>
                ${questionImageHtml}
              </div>
              <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 8px; font-size: 12px; color: #666; flex-shrink: 0; margin-left: 10px; align-self: flex-start;">
                ${q.points || 1} point${q.points !== 1 ? 's' : ''}
              </span>
            </div>
            <div style="margin-left: 12px;">
              ${optionsHtml}
            </div>
          </div>
        `;
      })
      .join("");

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || "Exam"}</title>
          <style>
            @page { margin: 0.25in; size: auto; }
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; padding: 15px;
              line-height: 1.3; color: #000;
              max-width: 800px; margin: 0 auto;
              font-size: 12px;
            }
            h1 { 
              text-align: center; color: #000; 
              margin: 0 0 10px 0; padding-bottom: 8px;
              border-bottom: 1px solid #ccc;
              font-size: 18px; font-weight: bold;
            }
            .header-info { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
            .stats { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
            .stat-item {
              background: #f0f0f0; color: #000; padding: 3px 8px;
              border-radius: 10px; font-size: 10px; border: 1px solid #ccc;
            }
            @media print {
              body { margin: 0; padding: 10px; font-size: 11px; }
              .no-print { display: none; }
              h1, .header-info, .instructions { page-break-after: avoid; }
              .question-container { page-break-inside: auto; }
              img { max-width: 100% !important; height: auto !important; page-break-inside: avoid; }
              @page { margin: 0.2in; }
            }
            .instructions {
              background: #f8f8f8; padding: 10px; border-radius: 4px;
              margin-bottom: 12px; border-left: 2px solid #2196F3;
              font-size: 11px;
            }
            .instructions h3 { margin: 0 0 6px 0; color: #000; font-size: 14px; font-weight: bold; }
            .instructions p { margin: 0; font-size: 11px; }
            .questions-header {
              font-size: 14px; font-weight: bold; margin: 15px 0 10px 0;
              color: #000; padding-bottom: 6px; border-bottom: 1px solid #ccc;
            }
            .answer-key {
              background: #f8f8f8; padding: 12px; border-radius: 4px;
              margin-top: 20px; border-left: 2px solid #4CAF50;
              font-size: 11px; page-break-before: always;
            }
            .answer-key h3 { color: #000; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; }
            .answer-key p { margin: 0; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px;">
            <button onclick="window.print()" style="background: #183D65; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
              📄 Print Exam
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; margin-left: 6px;">
              ✕ Close
            </button>
          </div>
          
          <h1>${title || "Exam"}</h1>
          
          <div class="header-info">
            <div class="stats">
              <span class="stat-item">${editableQuestions.length} Questions</span>
              <span class="stat-item">${totalPoints} Total Points</span>
              <span class="stat-item">${duration || 60} Minutes</span>
              ${lesson_ids.length > 0 ? `<span class="stat-item">${lesson_ids.length} Lesson${lesson_ids.length !== 1 ? 's' : ''}</span>` : ''}
            </div>
          </div>
          
          ${instructions ? `
            <div class="instructions">
              <h3>Instructions</h3>
              <p style="white-space: pre-line;">${instructions}</p>
            </div>
          ` : ''}
          
          <div class="questions-header">Exam Questions</div>
          <div class="question-container">
            ${content}
          </div>
          
          <div class="answer-key">
            <h3>Answer Key</h3>
            <p>${answerKey}</p>
          </div>
        </body>
      </html>
    `);

    win.document.close();
  };

  /* =========================
     Back to TOS
  ========================== */
  const handleBackToTOS = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#102E50] to-[#1a3f6e] px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToTOS}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  title="Back to TOS"
                >
                  <FiArrowLeft className="text-white text-lg" />
                </button>
                <button
                  onClick={() => alert(opening_time)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  title="Back to TOS"
                >
                  <FiArrowLeft className="text-white text-lg" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{title || "Untitled Exam"}</h1>
                  <p className="text-blue-100 text-sm mt-1 opacity-90">
                    Ready to assign to students
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                <FiCheckCircle className="text-green-300" />
                <span className="font-medium">Status: Ready</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center">
                  <div className="p-2.5 bg-blue-100 rounded-lg mr-3">
                    <FiFileText className="text-[#102E50] text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="text-2xl font-bold text-[#102E50]">{editableQuestions.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center">
                  <div className="p-2.5 bg-green-100 rounded-lg mr-3">
                    <FiBarChart2 className="text-green-700 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-green-700">{totalPoints}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center">
                  <div className="p-2.5 bg-purple-100 rounded-lg mr-3">
                    <FiClock className="text-purple-700 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-2xl font-bold text-purple-700">{duration || 60} min</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center">
                  <div className="p-2.5 bg-amber-100 rounded-lg mr-3">
                    <FiBook className="text-amber-700 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lessons</p>
                    <p className="text-2xl font-bold text-amber-700">{lesson_ids.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center">
                  <div className="p-2.5 bg-red-100 rounded-lg mr-3">
                    <FiClock className="text-red-700 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Closes</p>
                    <p className="text-lg font-bold text-red-700">
                      {closing_time ? new Date(closing_time).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {instructions && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FiAlertCircle className="text-[#102E50] text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-[#102E50]">Exam Instructions</h3>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{instructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#102E50] mb-2">Exam Actions</h2>
              <p className="text-gray-600 text-sm">Manage, edit, and assign your exam</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-wrap gap-3">
                <ClassicButton
                  buttonName={isEditing ? "Done Editing" : "Edit Questions"}
                  icon={isEditing ? FiSave : FiEdit}
                  onClick={() => setIsEditing(!isEditing)}
                  mainColor="#E78B48"
                  darkColor="#B9652B"
                  disabled={assigning}
                  className="shadow-md hover:shadow-lg transition-shadow"
                />
                <ClassicButton
                  buttonName="Print Exam"
                  icon={FiPrinter}
                  onClick={handlePrint}
                  mainColor="#64748B"
                  darkColor="#475569"
                  disabled={assigning}
                  className="shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
              
              <div className="relative">
                <ClassicButton
                  buttonName={
                    <div className="flex items-center">
                      Assign to Students
                      {selectedStudents.length > 0 && (
                        <span className="ml-2 bg-white text-[#102E50] text-xs font-bold px-2 py-0.5 rounded-full">
                          {selectedStudents.length}
                        </span>
                      )}
                    </div>
                  }
                  icon={FiUserPlus}
                  onClick={() => setShowStudentSelect(true)}
                  mainColor="#183D65"
                  darkColor="#102E50"
                  disabled={assigning}
                  className="shadow-md hover:shadow-lg transition-shadow"
                />
                {selectedStudents.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-[#E78B48] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {selectedStudents.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
              <div className="flex items-start">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <FiAlertCircle className="text-red-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800 mb-1">Action Required</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-xl p-5 shadow-sm">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800 mb-1">Success!</h3>
                  <p className="text-green-700 mb-2">{success}</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full animate-progress" style={{animationDuration: '3s'}}></div>
                    </div>
                    <span className="ml-3">Redirecting in 3 seconds...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Section Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2.5 bg-[#102E50] rounded-xl mr-3">
                <FiFileText className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#102E50]">Exam Questions</h2>
                <p className="text-gray-600 text-sm">
                  {isEditing ? "Editing mode is active" : "Review your exam questions"}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${isEditing ? 'bg-[#E78B48]/10 text-[#E78B48] border border-[#E78B48]/20' : 'bg-blue-100 text-blue-800'}`}>
              {isEditing ? '📝 Editing Mode' : '👁️ View Mode'}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {editableQuestions.map((q, i) => (
            <div key={q.id || i} className="transform transition-all duration-200 hover:translate-x-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <ExamQuestionEditor
                  question={q}
                  index={i}
                  isEditing={isEditing}
                  onUpdate={handleQuestionUpdate}
                  optionLetters={optionLetters}
                  showPoints={true}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {editableQuestions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-4">
              <FiFileText className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              This exam doesn't have any questions yet. Please check the generation process or contact support.
            </p>
          </div>
        )}

        {/* Footer Stats */}
        {editableQuestions.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FiUsers className="text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">
                    {students.length} students in class
                  </span>
                </div>
                {closing_time && (
                  <>
                    <div className="hidden md:block text-gray-300">•</div>
                    <div className="hidden md:flex items-center">
                      <FiClock className="text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        Closes: {new Date(closing_time).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Exam Value</p>
                <p className="text-2xl font-bold text-[#102E50]">{totalPoints} Points</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Select Modal */}
      {showStudentSelect && (
        <StudentSelectModal
          students={students}
          selectedStudents={selectedStudents}
          onToggle={toggleStudent}
          onSelectAll={selectAllStudents}
          onConfirm={handleAssign}
          onCancel={() => setShowStudentSelect(false)}
          title={`Assign Exam: ${title}`}
          confirmText={assigning ? "Assigning..." : "Assign Exam"}
          isAssigning={assigning}
          totalStudents={students.length}
          selectedCount={selectedStudents.length}
        />
      )}
    </div>
  );
}
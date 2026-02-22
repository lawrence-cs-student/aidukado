import { useState, useEffect, useMemo } from "react";
import axios from "../../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import classStore from "../../store/useClassStore";
import useTermStore from "../../store/useTermStore";
import QuestionEditor from "./QuestionEditor";
import StudentSelectModal from "./StudentSelectModal";
import { FiSave, FiEdit, FiUserPlus, FiPrinter } from "react-icons/fi";
import ClassicButton from "../classicButton";

export default function AssignQuiz({
  questions = [],
  title = "",
  total_points = 0,
  lesson_id,
  instructions = "",
  duration = 0,
  assessment_type = "",
  opening_time="",
  closing_time = ""
  
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState([]);
  const [showStudentSelect, setShowStudentSelect] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const class_id = classStore((state) => state.classId);
  const term_id = useTermStore((state) => state.termId);
  const navigate = useNavigate();

  const optionLetters = useMemo(() => ["A", "B", "C", "D"], []);

  /* =========================
     Fetch Students
  ========================== */
  useEffect(() => {
    if (!class_id) return;

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getStudentsByClass/${class_id}`
        );
        setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [class_id]);

  /* =========================
     Normalize Questions
  ========================== */
  const stripQuestionPrefix = (text) =>
    text.replace(/^\d+[\s.)-]+\s*/, "");

  const stripOptionPrefix = (text) =>
    text.replace(/^[A-Da-d][\s.)-]+\s*/, "");

  useEffect(() => {
    const normalized = (questions || []).map((q) => ({
      question: stripQuestionPrefix(q.question ?? ""),
      options: Array.isArray(q.options)
        ? q.options.map((opt) =>
            typeof opt === "string"
              ? { text: stripOptionPrefix(opt), image: null }
              : { ...opt, text: stripOptionPrefix(opt.text || "") }
          )
        : [],
      answer: q.answer ?? "",
      questionImage: q.questionImage ?? null,
    }));

    setEditableQuestions(normalized);
  }, [questions]);

  /* =========================
     Handlers
  ========================== */
  const handleQuestionUpdate = (index, updatedQuestion) => {
    const updated = [...editableQuestions];
    updated[index] = updatedQuestion;
    setEditableQuestions(updated);
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  /* =========================
     Assign Quiz
  ========================== */
  const handleAssign = async () => {
    if (!title.trim()) return alert("Quiz title is required");
    if (!lesson_id) return alert("Lesson ID missing");
    if (!editableQuestions.length) return alert("No questions added");
    if (!selectedStudents.length)
      return alert("Select at least one student");

    const formattedClosingTime = closing_time ? new Date(closing_time).toISOString() : null;
    const formattedOpeningTime = opening_time ? new Date(opening_time).toISOString() : null;
    
    // Also set opening_time to current time
    //const openingTime = new Date().toISOString();

    const payload = {
      lesson_id,
      title,
      total_points,
      instructions,
      quiz_content: editableQuestions,
      duration,
      class_id,
      is_archive: false,
      assessment_type,
      term_id,
      assigned_students: selectedStudents,
      opening_time: formattedOpeningTime,
      closing_time: formattedClosingTime,
    };
    console.log("payload", payload)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/assignQuiz`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Quiz assigned successfully!");
      navigate(-2);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Assignment failed");
    }
  };

  

  /* =========================
     Print Quiz
  ========================== */
  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return alert("Popup blocked");

    const content = editableQuestions
      .map(
        (q, i) => `
        <div>
          <p><strong>${i + 1}. ${q.question}</strong></p>
          ${
            q.options.length
              ? q.options
                  .map(
                    (o, idx) => `<p>${optionLetters[idx]}. ${o.text}</p>`
                  )
                  .join("")
              : "<p><em>True or False</em></p>"
          }
        </div>
      `
      )
      .join("");

    win.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body>
          <h1>${title}</h1>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-5xl p-6">
          <div className="flex flex-wrap justify-end gap-3 mb-6">
            <ClassicButton
              buttonName={isEditing ? "Done Editing" : "Edit Questions"}
              icon={isEditing ? FiSave : FiEdit}
              onClick={() => setIsEditing(!isEditing)}
              mainColor="#E78B48"
              darkColor="#B9652B"
            />
            <ClassicButton
              buttonName="Assign"
              icon={FiUserPlus}
              onClick={() => setShowStudentSelect(true)}
              mainColor="#183D65"
              darkColor="#102E50"
            />
            <ClassicButton
              buttonName="Print"
              icon={FiPrinter}
              onClick={handlePrint}
              mainColor="#64748B"
              darkColor="#475569"
            />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">
            {title || "Untitled Quiz"}
          </h1>

          {editableQuestions.map((q, i) => (
            <QuestionEditor
              key={i}
              question={q}
              index={i}
              isEditing={isEditing}
              onUpdate={handleQuestionUpdate}
              optionLetters={optionLetters}
            />
          ))}
        </div>
      </div>

      {showStudentSelect && (
        <StudentSelectModal
          students={students}
          selectedStudents={selectedStudents}
          onToggle={toggleStudent}
          onConfirm={handleAssign}
          onCancel={() => setShowStudentSelect(false)}
        />
      )}
    </>
  );
}

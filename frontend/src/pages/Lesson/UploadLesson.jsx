import FileUploader from "../../components/FileUploader";
import { useState, useEffect } from "react";
import useClassStore from "../../store/useClassStore";
import axios from "../../services/axiosConfig";

import { FaExclamationCircle, FaCloudUploadAlt, FaTimes, FaHeading, FaTag, FaPen, FaChevronDown, FaAlignLeft, 
FaStar, FaChartBar, FaCalendarAlt, FaClock, FaSpinner } from 'react-icons/fa';

export default function UploadLesson({ setIsOpen, onSuccess, term, setSuccessMessage }) {
  const classId = useClassStore((state) => state.classId);
  const [uploadError, setUploadError] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Add upload state

  // Function to get default due date (tomorrow at 11:59 PM)
  // Function to get default due date (today's date and current time)
  const getDefaultDueDate = () => {
    const now = new Date();
    
    // Format to "YYYY-MM-DD HH:MM:SS" for backend
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };

  const [metaData, setMetaData] = useState({
    classId: classId,
    termId: term,
    title: "",
    description: "",
    type: "lesson",      
    totalScore: null,    
    dueDate: null        
  });

  // Set default due date when component mounts and when type changes to non-lesson
  useEffect(() => {
    if (metaData.type !== "lesson" && !metaData.dueDate) {
      const defaultDueDate = getDefaultDueDate();
      setMetaData(prev => ({ ...prev, dueDate: defaultDueDate }));
    }
  }, [metaData.type]);

  useEffect(() => {
    setMetaData((prev) => ({
      ...prev,
      termId: term,
    }));
  }, [term]);

  const maxFileSize = 20 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > maxFileSize) {
      alert("File size exceeds 5 MB. Please upload a smaller file.");
      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    if (!metaData.title.trim()) {
      setUploadError("Please enter a title!");
      return;
    }

    if (!metaData.termId) {
      setUploadError("Invalid term selected!");
      return;
    }

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metaData));
    formData.append("file", file);

    try {
      setIsUploading(true); // Start uploading
      setUploadError(""); // Clear any previous errors

      const baseUrl = `${import.meta.env.VITE_API_URL}`;
      const url = `${baseUrl}/class_material/upload`;

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(response.data.message);
      if (onSuccess) onSuccess();
      setIsOpen(false); // Close the modal on success
    } catch (err) {
      if (err.response?.data?.detail) {
        setUploadError(err.response.data.detail);
      } else {
        setUploadError("Network Error");
      }
    } finally {
      setIsUploading(false); // Stop uploading regardless of success or error
    }
  };

  // Function to format date for datetime-local input
  const getDateTimeLocalValue = () => {
    if (!metaData.dueDate) return "";
    
    
    if (typeof metaData.dueDate === 'string') {
      
      const dbFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      
      if (dbFormatRegex.test(metaData.dueDate)) {
        
        return metaData.dueDate.substring(0, 16).replace(' ', 'T');
      }
      
      
      if (metaData.dueDate.includes('T')) {
        return metaData.dueDate.substring(0, 16);
      }
    }
    
    
    try {
      const date = new Date(metaData.dueDate);
      if (!isNaN(date.getTime())) { // Check if valid date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    } catch (e) {
      // Ignore error
    }
    
    return ""; // Final fallback
  };

  const handleDueDateChange = (e) => {
    const value = e.target.value;
    
    if (value) {
      // Convert "2026-01-22T22:59" to "2026-01-22 22:59:00"
      const dbFormatted = value.replace('T', ' ') + ':00';
      setMetaData(prev => ({ ...prev, dueDate: dbFormatted }));
    } else {
      setMetaData(prev => ({ ...prev, dueDate: null }));
    }
  };

  return (
    <form
      className="flex flex-col w-full h-auto gap-4 text-left rounded-2xl bg-gray-50 px-6 py-8 shadow-xl border border-gray-200"
    >
      {uploadError && (
        <div className="flex items-center p-3 mb-2 rounded-lg bg-red-50 border border-red-200">
          <FaExclamationCircle className="text-red-500 mr-3" />
          <p className="text-red-800 font-medium">{uploadError}</p>
        </div>
      )}
      
      <div className="mb-2">
        <span className="text-xs text-[#102E50]/80 mt-1">Max Size: 20mb</span>
        <FileUploader type=".pdf, .doc, .docx, .pptx, .ppt" handleFileChange={handleFileChange} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#102E50] mb-1">
          Title
        </label>
        <div className="relative">
          <input
            className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
            value={metaData.title}
            placeholder="Enter the material name"
            onChange={(e) => setMetaData((prev) => ({ ...prev, title: e.target.value }))}
          />
          <FaPen className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#102E50] mb-1">
          {metaData.type == "lesson" ? "Description" : "Instruction"} 
        </label>
        <textarea
          className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-y"
          value={metaData.description}
          onChange={(e) => setMetaData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe this material..."
          rows={4}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#102E50] mb-1">
          Type
        </label>
        <div className="relative">
          <select
            name="type"
            value={metaData.type}
            onChange={(e) => {
              const newType = e.target.value;
              setMetaData(prev => ({ 
                ...prev, 
                type: newType,
                // Set default due date when switching to non-lesson type
                dueDate: newType !== "lesson" && !prev.dueDate ? getDefaultDueDate() : prev.dueDate
              }));
            }}
            className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 appearance-none pr-10"
          >
            <option value="lesson">Lesson</option>
            <option value="experiment">Experiment / Exercise</option>
            <option value="activity">Assignment / Activity</option>
            <option value="project">Project / Case Study</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        </div>
      </div>


      {metaData.type != "lesson" && (
        <div className="space-y-4 mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-semibold text-[#102E50] mb-1">
              <FaStar className="mr-2 text-sm" />Total Score
            </label>
            <div className="relative">
              <input
                className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                type="number"
                value={metaData.totalScore || ""}
                placeholder="Enter total score"
                onChange={(e) =>
                  setMetaData((prev) => ({
                    ...prev,
                    totalScore: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
              />
              <FaChartBar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-semibold text-[#102E50] mb-1">
              <FaCalendarAlt className="mr-2 text-sm" />Due Date
            </label>
            <div className="relative">
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent 
                transition-all duration-200 bg-[#102E50] text-white placeholder:text-white/70"
                type="datetime-local"
                value={getDateTimeLocalValue()}
                onChange={handleDueDateChange}
                step="60"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsOpen(false)}
          disabled={isUploading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white font-semibold text-[#102E50] rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          type="button"
        >
          <FaTimes className="mr-1" />CANCEL
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#102E50] text-white font-semibold rounded-lg border border-[#102E50] transition-all duration-200 hover:bg-[#0e2642] hover:shadow-md active:scale-95 shadow disabled:opacity-70 disabled:cursor-wait disabled:active:scale-100"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="mr-1 animate-spin" />UPLOADING...
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="mr-1" />UPLOAD
            </>
          )}
        </button>
      </div>
    </form>
  );
}
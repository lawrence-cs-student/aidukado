import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/axiosConfig";
import AssignExam from '../../components/AssignExam/AssignExam';
import LoadingSpinner from '../../components/AIQuiz/LoadingSpinner';
import { 
  FaFileAlt, 
  FaGraduationCap, 
  FaListAlt, 
  FaClock, 
  FaHourglassHalf, 
  FaBook, 
  FaTimes, 
  FaMagic,
  FaExclamationCircle,
  FaCalendarAlt
} from 'react-icons/fa';

export default function AIExam() {
  const { classId, termId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lessons, setLessons] = useState([]);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    instruction: "",
    duration: "",
    totalItems: null,
    hours: {},
    closing_time: "",
    error: "",
    success: "",
    opening_time: ""
  });

  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  // Set default datetime (tomorrow at 23:59)
  const setDefaultDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    
    // Format to YYYY-MM-DDTHH:MM
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const hours = String(tomorrow.getHours()).padStart(2, '0');
    const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Calculate minimum datetime (30 minutes from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Format date for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Fetch lessons on component mount
  useEffect(() => {
    if (!classId || !termId) {
      setFormData(prev => ({ 
        ...prev, 
        error: "Missing class or term information" 
      }));
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/class_material/getByClassId/${classId}/term/${termId}`
        );
        setLessons(response.data || []);
        
        // Initialize hours object with 0 values
        const initialHours = {};
        const filtered = response.data.filter(lesson => lesson.type === "lesson");
        filtered.forEach(lesson => {
          initialHours[lesson.id] = 0;
        });
        
        // Initialize closing_time with default value
        setFormData(prev => ({ 
          ...prev, 
          hours: initialHours,
          closing_time: setDefaultDateTime(),
          opening_time: now
        }));

        
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setFormData(prev => ({ 
          ...prev, 
          error: "Failed to load lessons. Please try again." 
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [classId, termId]);

  // Validation helper
  const validateForm = () => {
    const { title, totalItems, duration, closing_time } = formData;

    if (!title.trim()) {
      return "Please enter an exam title";
    }
    
    if (title.length < 3) {
      return "Exam title must be at least 3 characters long";
    }
    
    if (title.length > 100) {
      return "Exam title must be less than 100 characters";
    }

    if (!totalItems || isNaN(totalItems) || totalItems <= 0) {
      return "Please enter a valid number of items";
    }
    
    if (totalItems > 100) {
      return "Maximum 100 questions allowed";
    }
    
    if (totalItems < 5) {
      return "Minimum 5 questions required";
    }

    if (!duration || isNaN(duration) || duration <= 0) {
      return "Please enter a valid duration";
    }
    
    if (duration < 15) {
      return "Minimum duration is 15 minutes";
    }
    
    if (duration > 90) {
      return "Maximum duration is 90 minutes";
    }

    // Validate closing time
    if (!closing_time) {
      return "Please select a closing time";
    }

    const closingDate = new Date(closing_time);
    const minDate = new Date(getMinDateTime());
    
    if (closingDate < minDate) {
      return "Closing time must be at least 30 minutes from now";
    }

    // Check if at least one lesson has hours > 0
    const lessonsWithHours = lessons.filter(lesson => {
      const hours = formData.hours[lesson.id];
      return hours && !isNaN(hours) && parseFloat(hours) > 0;
    });
    
    if (lessonsWithHours.length === 0) {
      return "Please set hours for at least one lesson";
    }

    // Validate hours are numbers and positive
    const invalidHours = lessons.some(lesson => {
      const hours = formData.hours[lesson.id];
      return hours && (isNaN(hours) || parseFloat(hours) < 0);
    });
    
    if (invalidHours) {
      return "Please enter valid hour values (0 or positive numbers)";
    }

    return null;
  };

  const handleSubmit = async () => {
    // Clear previous messages
    setFormData(prev => ({ ...prev, error: "", success: "" }));
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setFormData(prev => ({ ...prev, error: validationError }));
      return;
    }

    setGenerating(true);
    setLoading(true);

    try {
      // Filter lessons with hours > 0 and ensure they're valid
      const lessonsWithHours = lessons.filter(lesson => {
        const hours = parseFloat(formData.hours[lesson.id]);
        return !isNaN(hours) && hours > 0;
      });

      if (lessonsWithHours.length === 0) {
        throw new Error("No valid lessons with hours selected");
      }

      // Prepare payload
      const payload = {
        total_items: parseInt(formData.totalItems, 10),
        closing_time: formData.closing_time, 
        lessons: lessonsWithHours.map((lesson) => ({
          lesson_id: lesson.id,
          title: lesson.title,
          hours: parseFloat(formData.hours[lesson.id]),
        }))
      };

      console.log("Sending TOS payload:", payload);

      // Generate exam via TOS
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/exam/compute_tos`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 180000 // 30 second timeout
        }
      );

      console.log("TOS Response:", response.data);

      const generatedQuestions = response.data?.questions || [];
      const computedTOS = response.data?.computed_tos || [];

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions were generated by the AI");
      }

      // Validate generated questions have required fields
      const validQuestions = generatedQuestions.filter(q => 
        q.question && 
        q.options && 
        Array.isArray(q.options) && 
        q.options.length >= 2 &&
        q.answer
      );

      if (validQuestions.length === 0) {
        throw new Error("Generated questions missing required fields");
      }

      // Add points to each question based on TOS distribution
      const questionsWithPoints = validQuestions.map((q, index) => {
        // Find corresponding TOS entry for this question
        const tosEntry = computedTOS.find(tos => 
          tos.lesson_id === q.lesson_id
        );
        
        let points = 1; // Default
        if (tosEntry && tosEntry.items_percentage > 0) {
          // Distribute points proportionally
          points = Math.max(1, Math.round(
            (tosEntry.items_percentage / 100) * parseInt(formData.totalItems) / validQuestions.length
          ));
        }
        
        return {
          ...q,
          points: points,
          lesson_id: q.lesson_id || lessonsWithHours[0]?.id || 0,
          options: Array.isArray(q.options) ? q.options : [],
          question: q.question || `Question ${index + 1}`
        };
      });

      // Ensure we have the requested number of questions
      const finalQuestions = questionsWithPoints.slice(0, parseInt(formData.totalItems, 10));
      
      if (finalQuestions.length < parseInt(formData.totalItems, 10)) {
        console.warn(`Requested ${formData.totalItems} questions but only got ${finalQuestions.length}`);
      }

      setQuestions(finalQuestions);
      setFormData(prev => ({ 
        ...prev, 
        success: `Successfully generated ${finalQuestions.length} questions!` 
      }));

    } catch (error) {
      console.error("Exam generation error:", error);
      
      let errorMessage = "Failed to generate exam. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || 
                      error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Request setup error
        errorMessage = error.message;
      }
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. The server is taking too long to respond.";
      }
      
      setFormData(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      error: "" // Clear error when user types
    }));
  };

  const handleHoursChange = (lessonId, value) => {
    // Allow empty string for intermediate state, but validate on submit
    const numericValue = value === "" ? "" : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      error: "", // Clear error when hours change
      hours: {
        ...prev.hours,
        [lessonId]: numericValue,
      }
    }));
  };

  const handleReset = () => {
    setQuestions([]);
    setFormData({
      title: "",
      instruction: "",
      duration: "",
      totalItems: "",
      hours: {},
      closing_time: setDefaultDateTime(),
      error: "",
      success: "",
      opening_time:""
    });
  };
  
  // Filter lessons (only type "lesson")
  const filteredLessons = lessons.filter((lesson) => lesson.type === "lesson");

  // Calculate total hours entered
  const totalHours = Object.values(formData.hours || {}).reduce((sum, hours) => {
    const numHours = parseFloat(hours);
    return sum + (isNaN(numHours) ? 0 : numHours);
  }, 0);

  

  return (
    <div className="h-auto min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      {loading && !generating && <LoadingSpinner message="Loading lessons..." />}
      
      {generating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#E78B48] mb-4"></div>
              <h3 className="text-xl font-bold text-[#102E50] mb-2">Generating Exam</h3>
              <p className="text-gray-600 text-center">
                AI is creating your exam questions based on the TOS...
                <br />
                <span className="text-sm text-gray-500">This may take a moment</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="w-full lg:w-1/2 h-auto"> 
          <div className="bg-white px-8 py-10 rounded-2xl shadow-xl border border-gray-200 w-full h-auto">
            {/* Error Message */}
            {formData.error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <FaExclamationCircle className="mr-2" />
                  <span className="font-medium">{formData.error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {formData.success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700">
                  <FaExclamationCircle className="mr-2" />
                  <span className="font-medium">{formData.success}</span>
                </div>
              </div>
            )}

            <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
              <FaFileAlt className="text-[#E78B48] text-2xl mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-[#102E50] uppercase tracking-wide">
                  Table of Specifications
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Configure your exam and distribute hours per lesson
                </p>
              </div>
            </div>

            {/* Exam Configuration */}
            <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center text-lg font-bold text-[#102E50] mb-4">
                <FaGraduationCap className="mr-2 text-[#E78B48]" />
                Exam Configuration
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-[#102E50]">
                    <FaListAlt className="mr-2 text-sm" />
                    Exam Title *
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    type="text"
                    placeholder="e.g., Midterm Exam, Final Exam"
                    className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    disabled={generating}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-[#102E50]">
                    <FaListAlt className="mr-2 text-sm" />
                    Exam Instructions
                  </label>
                  <textarea
                    value={formData.instruction}
                    onChange={(e) => handleFormChange('instruction', e.target.value)}
                    placeholder="Enter exam instructions here..."
                    className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400 min-h-[100px] resize-y"
                    disabled={generating}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-[#102E50]">
                      <FaClock className="mr-2 text-sm" />
                      Duration (minutes) *
                    </label>
                    <input
                      value={formData.duration}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      type="number"
                      min="15"
                      max="90"
                      placeholder="e.g., 60"
                      className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      disabled={generating}
                    />
                    <p className="text-xs text-gray-500">Minimum: 15, Maximum: 90</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-[#102E50]">
                      <FaListAlt className="mr-2 text-sm" />
                      Total Items *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.totalItems}
                      placeholder="e.g., 50"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert to number, but handle empty string case
                        const numValue = value === '' ? '' : parseInt(value, 10);
                        handleFormChange('totalItems', numValue);
                      }}
                      onWheel={(e) => e.target.blur()}
                      className="w-full border border-gray-300 bg-white text-[#102E50] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      disabled={generating}
                    />
                    <p className="text-xs text-gray-500">Minimum: 1, Maximum: 100</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#0B2239]/10 rounded-lg border border-[#102E50]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="w-5 h-5 text-[#102E50]" />
                    <label className="font-semibold text-[#102E50]">
                      Opening Time:
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="datetime-local"
                      value={formData.opening_time || now}
                      onChange={(e) => handleFormChange('opening_time', e.target.value)}
                      className="flex-1 px-4 py-3 border border-[#102E50] rounded-lg bg-[#102E50]
                        focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent
                        text-white placeholder:text-white/70
                        shadow-inner"
                      disabled={generating}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {formData.opening_time && (
                      <p className="text-xs font-medium text-[#102E50]">
                        {formatDateTime(formData.opening_time)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Closing Time Section */}
                <div className="mt-4 p-4 bg-[#0B2239]/10 rounded-lg border border-[#102E50]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="w-5 h-5 text-[#102E50]" />
                    <label className="font-semibold text-[#102E50]">
                      Closing Time (Deadline) *
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="datetime-local"
                      value={formData.closing_time || setDefaultDateTime()}
                      onChange={(e) => handleFormChange('closing_time', e.target.value)}
                      min={getMinDateTime()}
                      className="flex-1 px-4 py-3 border border-[#102E50] rounded-lg bg-[#102E50]
                        focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent
                        text-white placeholder:text-white/70
                        shadow-inner"
                      disabled={generating}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[#102E50]/70">
                      Must be at least 30 minutes from now
                    </p>
                    {formData.closing_time && (
                      <p className="text-xs font-medium text-[#102E50]">
                        {formatDateTime(formData.closing_time)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons Hours */}
            <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center text-lg font-bold text-[#E78B48] uppercase tracking-wide">
                  <FaHourglassHalf className="mr-2" />
                  Hours Per Lesson *
                </h3>
                <div className="text-sm font-semibold text-[#102E50] bg-white px-3 py-1 rounded-full border">
                  Total: {totalHours.toFixed(1)} hours
                </div>
              </div>
              
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-white transition-colors duration-200 bg-white"
                    >
                      <div className="flex items-center w-[60%]">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#102E50] text-white rounded-lg flex items-center justify-center mr-3">
                          <FaBook className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#102E50] font-medium truncate" title={lesson.title}>
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="text-xs text-gray-500 truncate" title={lesson.description}>
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          placeholder="0.0"
                          value={formData.hours[lesson.id] || ""}
                          onChange={(e) => handleHoursChange(lesson.id, e.target.value)}
                          className="w-28 border border-gray-300 bg-white text-[#102E50] p-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          disabled={generating}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">hrs</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="font-medium">No lessons available</p>
                    <p className="text-sm mt-1">Add lessons in the class materials first</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * At least one lesson must have hours greater than 0
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white font-semibold text-[#102E50] rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={filteredLessons.length === 0 || generating}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-lg border transition-all duration-200 active:scale-95 shadow ${
                  filteredLessons.length === 0 || generating
                    ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                    : "bg-[#102E50] text-white border-[#102E50] hover:bg-[#0e2642] hover:shadow-md"
                }`}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-1" />
                    Generate Exam
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="w-full h-auto">
          <AssignExam 
            questions={questions} 
            title={formData.title} 
            instructions={formData.instruction} 
            duration={parseInt(formData.duration, 10)} 
            closing_time={formData.closing_time}
            lesson_ids={filteredLessons.filter(l => {
              const hours = parseFloat(formData.hours[l.id]);
              return !isNaN(hours) && hours > 0;
            }).map(l => l.id)}
            total_items={parseInt(formData.totalItems, 10)}
            classId={classId}
            termId={termId}
            onReset={handleReset}
            opening_time={formData.opening_time}
          />
        </div>
      )}
    </div>
  );
}
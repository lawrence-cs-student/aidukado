import ClassicButton from "../classicButton";
import { LuWand } from "react-icons/lu";
import { useState, useEffect } from 'react';


export default function QuizForm({ formData, onChange, onSubmit, loading }) {
  const inputClass = `w-full p-2 rounded-lg border border-gray-300 bg-gray-100 text-md text-[#102E50] 
                        focus:outline-none focus:ring-2 focus:ring-[#102E50]/40 transition 
                        mb-4 duration-200`;
  const labelClass = "text-[#102E50] font-bold mb-1 block";

  //const getDefaultTime = () => new Date().toISOString().slice(0, 16);
  const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);
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

  const handleChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`);
    onChange({ ...formData, [field]: value });
  };

  // Initialize closing_time with default value
  useEffect(() => {
    if (!formData.closing_time || !formData.start_time) {
      onChange({
        ...formData,
        closing_time: setDefaultDateTime(),
        opening_time: now,
      });
    }
  }, []);
  

  return (
    <form 
      className="max-w-md w-full h-auto m-auto p-6 bg-white rounded-2xl shadow-lg overflow-y-auto bg-[#EBECF1]"
    >
      <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-[#102E50] mb-1">
        AI-Quiz Generation
      </h1>
      <p className="text-sm xl:text-md 2xl:text-lg text-[#102E50]/70 mb-6 italic">
        create quiz using AI
      </p>

      {formData.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {formData.error}
        </div>
      )}

      <label className={labelClass}>
        Title: <span className="text-red-500">*</span>
      </label>
      <input
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        type="text"
        placeholder="Enter Title"
        className={inputClass}
        required
      />
      
      <div className="flex items-center justify-between">
        <label className={labelClass}>
          Number of items: <span className="text-red-500">*</span> 
        </label>
        <p className="text-xs text-gray-500">Minimum: 1, Maximum: 30</p>
      </div>
      
      <input
        value={formData.items}
        onChange={(e) => handleChange('items', e.target.value)}
        type="number"
        min="1"
        max="30"
        placeholder="Enter Number of Items"
        className={inputClass}
        required
      />
      
      <div className="flex items-center justify-between">
        <label className={labelClass}>
          Assessment Duration (minutes): <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500">Maximum: 60</p>
      </div>
      
      <input
        value={formData.duration}
        onChange={(e) => handleChange('duration', e.target.value)}
        type="number"
        min="1"
        max="120"
        placeholder="Set assessment timer"
        className={inputClass}
        required
      />

      <div className="mb-4 p-4 bg-[#0B2239]/10 rounded-lg border border-[#102E50]/20 text-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-[#102E50]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <label className="font-semibold text-[#102E50]">
            Start Time : <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="datetime-local"
            value={formData.opening_time || now}
            onChange={(e) => handleChange('opening_time', e.target.value)}
            className="flex-1 px-4 py-3 border border-[#102E50] rounded-lg bg-[#102E50]
              focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent
              text-white placeholder:text-white/70
              shadow-inner"
            style={{ colorScheme: 'dark' }}
            required
          />
        </div>
      </div>

      {/* Closing Time Section - Exact copy from TaskReopenModal */}
      <div className="mb-4 p-4 bg-[#0B2239]/10 rounded-lg border border-[#102E50]/20">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-[#102E50]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <label className="font-semibold text-[#102E50]">
            Closing Time (Deadline): <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="datetime-local"
            value={formData.closing_time || setDefaultDateTime()}
            onChange={(e) => handleChange('closing_time', e.target.value)}
            min={getMinDateTime()}
            className="flex-1 px-4 py-3 border border-[#102E50] rounded-lg bg-[#102E50]
              focus:outline-none focus:ring-2 focus:ring-[#E78B48] focus:border-transparent
              text-white placeholder:text-white/70
              shadow-inner"
            style={{ colorScheme: 'dark' }}
            required
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-[#102E50]/70">
            Must be at least 30 minutes from now
          </p>
        </div>
      </div>

      <label className={labelClass}>Instruction:</label>
      <textarea
        value={formData.instruction}
        onChange={(e) => handleChange('instruction', e.target.value)}
        placeholder="Enter Instruction (optional)"
        className={`${inputClass} min-h-[80px] resize-y`}
        rows="3"
      />

      <label className={labelClass}>
        Choose Assessment Type: <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.assessment_type}
        onChange={(e) => handleChange('assessment_type', e.target.value)}
        className={inputClass}
        required
      >
        <option value="">Choose Type</option>
        <option value="Quiz">Quiz</option>
        <option value="Seatwork">Seatwork</option>
      </select>

      <label className={labelClass}>
        Choose Question Type: <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.question_type}
        onChange={(e) => handleChange('question_type', e.target.value)}
        className={inputClass}
        required
      >
        <option value="">Select Type</option>
        <option value="multiple_choice">Multiple Choice</option>
        <option value="true_false">True or False</option>
      </select>

      <ClassicButton 
        buttonName="Generate Assessment"
        className="shadow-md place-self-end w-full mt-5"
        onClick={onSubmit}
        mainColor="#E78B48" 
        darkColor="#B9652B"
        icon={LuWand}
        disabled={loading}
      />
    </form>
  );
}
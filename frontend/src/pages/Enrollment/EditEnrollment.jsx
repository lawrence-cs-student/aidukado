import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

export default function EditEnrollment({ enrollmentId, classOptions, studentOptions, setSuccess, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    classId: "",
    studentId: "",
    status: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [formError, setFormError] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const labelClass = "text-[#102E50] font-bold opacity-75";
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#102E50",
      backgroundColor: state.isSelected
        ? "#102E50"
        : state.isFocused
        ? "#E6F0FA"
        : "white",
      padding: 10,
      cursor: "pointer"
    })
  };

  const getEnrollmentData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/enrollment/getById/${enrollmentId}`);
      setFormData({
        classId: response.data.classId,   
        studentId: response.data.studentId,
        status: response.data.status
      });
    } catch (err) {
      if (err.response?.data?.detail) {
        setFetchError(err.response.data.detail);
      } else {
        setFetchError("Network Error");
      }
    }
  };

  useEffect(() => {
    getEnrollmentData();
  }, [enrollmentId]);

  const validate = () => {
    const currentErrors = {};

    if (!formData.classId) {
      currentErrors.classError = "Class is required";
    }

    if (!formData.studentId) {
      currentErrors.studentError = "Student is required";
    }

    if (!formData.status) {
      currentErrors.statusError = "Status is required";
    }

    return currentErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();

    if (Object.keys(validation).length > 0) {
      setFormError(validation);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.patch(`http://localhost:8000/enrollment/patch/${enrollmentId}`,
        {
          class_id: formData.classId,     
          student_id: formData.studentId,
          status: formData.status
        }
      );

      setSuccess(response.data.message);
      setFormError({});

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.data?.detail) {
        setSubmitError(err.response.data.detail);
      } else {
        setSubmitError("Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">
      {fetchError && <p className="text-red-800">{fetchError}</p>}
      {submitError && <p className="text-red-800">{submitError}</p>}
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col w-full h-full gap-[2%] text-left rounded-2xl"
      >
        <label className={labelClass}>Class Name</label>
        <Select
          value={classOptions.find((option) => option.value === formData.classId) || null}  
          options={classOptions}
          onChange={(selected) =>
            setFormData((prev) => ({ ...prev, classId: selected.value })) 
          }
          styles={customStyles}
        />
        {formError.classError && <p className="text-red-800">{formError.classError}</p>}

        <label className={labelClass}>Student Name</label>
        <Select
          value={studentOptions.find((option) => option.value === formData.studentId) || null} 
          options={studentOptions}
          onChange={(selected) =>
            setFormData((prev) => ({ ...prev, studentId: selected.value })) 
          }
          styles={customStyles}
        />
        {formError.studentError && <p className="text-red-800">{formError.studentError}</p>}

        <label className={labelClass}>Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full h-[15%] bg-gray-700 rounded-md p-2"
        >
          <option value="">select a status</option>
          <option value="enrolled">Enrolled</option>
          <option value="dropped">Dropped</option>
          <option value="finished">Finished</option>
        </select>
        {formError.statusError && <p className="text-red-800">{formError.statusError}</p>}

        <div className="flex gap-2">
          <button
            className="w-1/2 mt-[1%] bg-[#EBEBEB] font-bold text-[#102E50] transition-transform duration-200 hover:scale-95 shadow-md"
            onClick={onClose}
            type="button"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="w-1/2 mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95 shadow-md"
          >
            {loading ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";

export default function AddUser({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    middleName: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const currentErrors = {};

    if (!formData.email) {
      currentErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      currentErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      currentErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      currentErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.role) {
      currentErrors.role = "Role is required";
    }

    if (!formData.firstName) {
      currentErrors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      currentErrors.lastName = "Last Name is required";
    }

    return currentErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {

      

      const res = await axios.post("http://localhost:8000/user/create", formData, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccess(`User Created: ${res.data.email}`);

      setFormData({
        email: "",
        password: "",
        role: "",
        firstName: "",
        lastName: "",
        middleName: ""
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.data?.detail) {
        setErrors({ api: err.response.data.detail });
      } else {
        setErrors({ api: "Network Error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-[8%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md";
  const labelClass = "text-[#102E50] font-bold opacity-75";

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">
      {errors.api && <p className="text-red-800">{errors.api}</p>}
      {success && <p className="text-green-800">{success}</p>}
      <MdClose
        size={24}
        color="#102E50"
        className="self-end"
        onClick={onClose}
      />
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col w-full h-full gap-[2%] text-left rounded-2xl"
      >
        <label className={labelClass}>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass}>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass}>Middle Name:</label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass}>Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass}>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass}>Role</label>
        <select
          value={formData.role}
          name="role"
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button
          type="submit"
          className="w-full mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95 shadow-md"
        >
          {loading ? "SUBMITTING..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    first_name: "",
    last_name: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value}));
  }

  const validate = () => {
    const currentErrors = {};

    if (!formData.email) {
      currentErrors.email = "Email is required";
    }else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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

    if (!formData.first_name) {
      currentErrors.first_name = "First Name is required";
    }

    if (!formData.last_name) {
      currentErrors.last_name = "Last Name is required";
    }

    return currentErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/auth/signup", formData, 
        {headers: {'Content-Type' : 'application/json'}
      });

      setSuccess(`User Created: ${res.data.email}`)

      setFormData({
        email: "",
        password: "",
        role: "",
        first_name: "",
        last_name: ""
      })
      navigate("/login");

    }catch (err) {
      if (err.response?.data?.detail) {
          setErrors({api : err.response.data.detail})
      } else {
          setErrors({api : "Network Error"});
      }
    }finally {
      setLoading(false);
    }

  }

  

  const inputClass = "w-4/5 h-[10%] border-solid border-2 border-[#C9CCD5] bg-transparent rounded-lg text-[#10375C] p-[1%]"
  const labelClass = "text-[#102E50] font-bold opacity-75"

  return (
    <div className="w-full h-screen flex flex-row ">
      <div className="w-[55%] h-full bg-white flex flex-col justify-center items-center" >
        
        {errors.api && <p className="text-red-800">{errors.api}</p>}
        {success && <p className="text-green-800">{success}</p>}

        
        <form onSubmit={handleSubmit}
              className="flex flex-col w-3/5 h-1/2 gap-[2%] "
        >
          <h2 className="text-[#102E50] text-4xl font-bold mb-[2%]">Sign Up</h2>

          <label className={labelClass}>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={inputClass}
          />

          <label className={labelClass}>Last Name:</label>
          <input 
            type="text"
            name="last_name"
            value={formData.last_name}
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
          <select name="role" onChange={handleChange} className={inputClass}>
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit" className="w-4/5 mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95">
            {loading ? "signing up..." : "signup"}
          </button>
        </form>
      </div>

      <div className="w-[45%] h-full flex justify-center items-center bg-black side-background-signup">
          <h1 className="text-white opacity-[0.9] text-4xl">
              Already Have an Account?
          </h1>
          <NavLink className="w-1/5 h-[5%]" to={"/login"}>
              <button className="w-full h-full mt-[6%] p-1 bg-[#102E50] text-white transition-transform duration-200 hover:scale-95">Login</button>
          </NavLink>
      </div>

      
    </div>
  )

}
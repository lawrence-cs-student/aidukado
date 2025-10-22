import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import useUserStore from "../store/useUserStore";

export default function Login() {

    const navigate = useNavigate();

    const storeUser = useUserStore((state) => state.storeUser);
    
    
    const [formData, setFormData] = useState({
        email : "",
        password : ""
    })
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));
    }

    const validate = () => {
        const currentErrors = {};
        if (!formData.email) {
            currentErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            currentErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            currentErrors.password = "Password is required";
        }

        return currentErrors;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/auth/login", formData, 
                {headers : {"Content-Type" : "application/json"} }
            );

            setSuccess(`User ${response.data.email} authenticated`);
            setFormData({
                email: "",
                password: ""
            })

            const id = response.data.id;
            const role = response.data.role;
            
            storeUser(id, role);

            navigate("/dashboard")
        } catch (err) {
            if (err.response?.data?.detail) {
                setErrors({api: err.response.data.detail})
            } else {
                setErrors({api: "Network Error"})
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="bg-[#333446] flex h-full w-full flex">
            
            {success && <p className="text-green-800">{success}</p>}
            
            <div className="flex h-full w-[60%] bg-white justify-center items-center flex-col">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-transparent backdrop-blur-md h-[60%] w-[50%] flex justify-center flex-col gap-2 rounded-3xl p-4"
                >
                    <h2 className="w-full text-[50px] font-extrabold text-[#102E50] self-center mb-1">WELCOME BACK TO AIDUKADO</h2>
                    <p2 className="w-full text-[#102E50] text-md mb-4">Aidukado is an AI-driven LMS that enhances learning through smart content generation and automation.</p2>

                    <label className="block font-medium mb-1 text-[#102E50] text-xl w-full">Email:</label>
                    <input 
                        onChange={handleChange}
                        type="text"
                        name="email"
                        value={formData.email}
                        className="bg-transparent border-2 rounded-md w-full h-[10%] p-1 text-[#102E50] mb-4" 
                        placeholder="Email"
                    />

                    <label className="block font-medium mb-1 text-[#102E50] text-xl w-full">Password:</label>
                    <input 
                        onChange={handleChange}
                        type="password"
                        name="password"
                        value={formData.password}
                        className="w-full bg-transparent border-2 rounded-md h-[10%] p-1 text-[#102E50] mb-4" 
                        placeholder="Password"

                    />
                    <a>Forgot Password?</a>
                    <button 
                        disabled={loading} 
                        className={`w-[40%] h-[10%] mt-2 p-1 bg-[#102E50] ${loading && "opacity-50"} rounded-md`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {errors.api && <p className="text-red-800">{errors.api}</p>}
                </form>
            </div>
            <div className="w-[40%] h-full image-background">
                 <img
                    className="w-1/2] h-[25%] object-contain rounded-b-lg m-auto shadow-lg float hidden md:block absolute right-[10%] top-[15%]"
                    src="/bookLogin.png"
                    alt="Lesson Preview"
                />
                <img
                    className="w-1/2 h-1/2 object-contain rounded-b-lg m-auto float hidden md:block absolute right-[50%] top-[35%]"
                    src="/bot.png"
                    alt="Lesson Preview"
                />
            
               
            </div>
        </div>
    )
}
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import useUserRoleStore from "../store/storeUserRole";

export default function Login() {

    const navigate = useNavigate();

    const storeUserRole = useUserRoleStore ((state) => state.storeUserRole);
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

            const role = response.data.role;
            storeUserRole(role);

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
        <div className="bg-[#333446] flex h-full w-full flex flex-col side-background">
            
            {success && <p className="text-green-800">{success}</p>}
            

            <div className="absolute left-[68%] top-[40%]">
                <h1 className="text-white opacity-[0.7] text-4xl">
                    <span className="block">Sign up to unlock personalized</span>
                    <span className="block">learning powered by AI</span>
                </h1>
                <NavLink to={"/signup"}>
                    <button className="w-[100%] h-[10%] mt-[6%] p-1 bg-[#333446] text-white">Signup</button>
                </NavLink>
            </div>
            <div className="flex h-full w-[60%] bg-white justify-center items-center flex-col">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-transparent h-[50%] w-[40%] flex justify-center flex-col gap-2 rounded-3xl p-[4%] border-2 border-[#7F8CAA] "
                >
                    <h2 className="text-3xl font-bold text-[#333446] self-center mb-4">Login</h2>

                    <label className="block font-medium mb-1 text-[#7F8CAA]">Email:</label>
                    <input 
                        onChange={handleChange}
                        type="text"
                        name="email"
                        value={formData.email}
                        className="bg-transparent border-2 rounded-md w-[95%] h-[10%] p-1 text-[#7F8CAA]" 
                        placeholder="Email"
                    />

                    <label className="block font-medium mb-1 text-[#7F8CAA]">Password:</label>
                    <input 
                        onChange={handleChange}
                        type="password"
                        name="password"
                        value={formData.password}
                        className="bg-transparent border-2 rounded-md w-[95%] h-[10%] p-1 text-[#7F8CAA]" 
                        placeholder="Password"

                    />
                    
                    <button 
                        disabled={loading} 
                        className={`w-[95%] h-[10%] mt-2 p-1 bg-[#333446] ${loading && "opacity-50"}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {errors.api && <p className="text-red-800">{errors.api}</p>}
                </form>
            </div>
        </div>
    )
}
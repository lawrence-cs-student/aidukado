
import axios from "axios";
import { useState } from "react";

export default function AddSubject({ onSuccess, onClose}) {
    
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    })

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target 
        setFormData((prev) => ({ ...prev, [name]: value}));
    }

    const validate = () => {
        const currentErrors = {};

        if (!formData.name) {
            currentErrors.name = "Subject Name is Required"
        }

        if (!formData.description) {
            currentErrors.description = "Subject Description is Required"
        }

        return currentErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({});
        setLoading(true);


        try {
            const response = await axios.post("http://localhost:8000/subject/create", formData, 
                {headers: {'Content-Type' : 'application/json'}
            });

            setSuccess(`Subject: ${response.data.name} created successfully`)

            setFormData({
                name: "",
                description: ""
            })

            if (onSuccess) onSuccess();
        } catch(err) {
            if (err.response?.data?.detail) {
                setErrors({api : err.response.data.detail})
            } else {
                setErrors({api : "Network Error"})
            }
        } finally {
            setLoading(false);
        }


    }



    const labelClass = "text-[#102E50] font-bold opacity-75"
    
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-2xl rounded-lg">
            {errors.api && <p className="text-red-800">{errors.api}</p>}
            {success && <p className="text-green-800">{success}</p>}

            <form
                method="post"
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full gap-[2%] text-left rounded-2xl"
            >
                
                <label className={labelClass}>Subject Name:</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-[15%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                />

                <label className={labelClass}>Description:</label>
                <textarea
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-[40%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                rows="5"
                cols="5"
                />

                <div className="flex gap-2">
                    <button 
                        className="w-1/2 mt-[1%] bg-[#EBEBEB] font-bold text-[#102E50] transition-transform duration-200 hover:scale-95 shadow-md"
                        onClick={onClose}
                        type="button"
                    >CANCEL
                        
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
    )
}
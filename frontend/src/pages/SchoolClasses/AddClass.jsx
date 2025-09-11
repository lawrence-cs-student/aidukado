
import { useState, useEffect } from "react"
import axios from "axios";

export default function AddClass({ onClose, onSuccess}) {


    const [formData, setFormData] = useState({
        subjectId: "",
        teacherId: "",
        name: ""
    })

    // For optionsss
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("")

    const [errors, setErrors] = useState({
        teacherError: "",
        subjectError: "",
        postError: ""
    })

    const [inputErrors, setInputErrors] = useState({})

    const labelClass = "text-[#102E50] font-bold opacity-75"

    const getTeachers = async () => {
        try{
            const response = await axios.get("http://localhost:8000/classes/get_teachers")

            setTeachers(response.data)
        } catch(err) {
            if(err.response?.data?.detail) {
                setErrors(prev => ({ ...prev, teacherError: err.response.data.detail}))
            } else {
                setErrors(prev => ({ ...prev, teacherError: "Network Error"}))
            }
        }
    }

    const getSubjects = async () => {
        try {
            const response = await axios.get("http://localhost:8000/subjects/get")

            setSubjects(response.data)
        } catch(err) {
            if (err.response?.data?.detail) {
                setErrors(prev => ({ ...prev, subjectError: err.response.data.detail}))
            } else {
                setErrors(prev => ({ ...prev, subjectError: "Network Error"}))
            }
        }
    }


     
    useEffect(()=> {
        getTeachers();
        getSubjects();
    }, [])

    
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name] : value}))
    }


    const validate = () => {
        const currentErrors = {};

        if (!formData.subjectId) {
            currentErrors.subjectId = "Subject Id is required"
        }

        if (!formData.teacherId) {
            currentErrors.teacherId = "Teacher Id is required"
        }

        if (!formData.name) {
            currentErrors.name = "Class name is required"
        }

        return currentErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setInputErrors(validationErrors)
            return
        }


        try {
            const response = await axios.post("http://localhost:8000/classes/create", formData, 
                {headers: {'Content-Type' : 'application/json'}}
            )

            setSuccess(`Class ${response.data.name} is created successfully`)

            setFormData({
                subjectId: "",
                teacherId: "",
                name: ""
            })

            if (onSuccess) onSuccess();

        } catch(err) {
            setErrors((prev) => ({...prev, postError: err.response?.data?.detail || "Network Error" })) 
        } finally {
            setLoading(false);
        }


    }


    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-2xl rounded-lg">
            {inputErrors.name && <p className="text-red-800">{inputErrors.name}</p>}
            {inputErrors.subjectId && <p className="text-red-800">{inputErrors.subjectId}</p>}
            {inputErrors.teacherId && <p className="text-red-800">{inputErrors.teacherId}</p>}
            
            {success && <p className="text-green-800">{success}</p>}
            {errors && (
                <>
                    <p className="text-red-800">{errors.teacherError}</p>
                    <p className="text-red-800">{errors.subjectError}</p>
                    <p className="text-red-800">{errors.postError}</p>
                </>
            )}
            <form
                method="post"
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full gap-[2%] text-left rounded-2xl"
            >

                <label htmlFor="name" className={labelClass}>Class Name:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-[15%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                />

                <label htmlFor="subjectId" className={labelClass}>Subject:</label>
                <select id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleChange} className="w-full h-[15%] bg-gray-700 rounded-md">
                    <option value="">select a subject</option>
                    {subjects.length > 0 ? (
                        subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)
                    ) : (<option disabled>Error fetching subjects</option>)}
                </select>

                <label htmlFor="teacherId" className={labelClass}>Teacher:</label>
                <select id="teacherId" name="teacherId" value={formData.teacherId} onChange={handleChange} className="w-full h-[15%] bg-gray-700 rounded-md">
                    <option value="">select a teacher</option>
                    {teachers.length > 0 ? (
                        teachers.map((teacher) => <option value={teacher.id} key={teacher.id}>{teacher.name}</option>)
                    ) : (<option disabled>Error fetching subjects</option>)}
                </select>

                
                <div className="flex gap-2 mt-4">
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
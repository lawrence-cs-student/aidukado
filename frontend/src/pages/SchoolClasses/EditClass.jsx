
import { useState, useEffect } from "react"
import axios from "axios";

export default function EditClass({class_id, onClose, onSuccess}) {


    const [formData, setFormData] = useState({
        subject_id: "",
        teacher_id: "",
        name: ""
    })

    

    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // For class data fetching error
    const [fetchError, setFetchError] = useState(""); 

    // For input errors
    const [formError, setFormError] = useState({});

    // For option errors
    const [errors, setErrors] = useState({});

    const [submitError, setSubmitError] = useState("");

    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    // Getting List of Teachers
    const getTeachers = async () => {
        try{
            const response = await axios.get("http://localhost:8000/user/get_teachers")
            setTeachers(response.data)
        } catch(err) {
            if(err.response?.data?.detail) {
                setErrors(prev => ({ ...prev, teacherError: err.response.data.detail}))
            } else {
                setErrors(prev => ({ ...prev, teacherError: "Network Error"}))
            }
        }
    }

    // Getting List of SUbjects

    const getSubjects = async () => {
        try {
            const response = await axios.get("http://localhost:8000/subject/get")

            setSubjects(response.data)
        } catch(err) {
            if (err.response?.data?.detail) {
                setErrors(prev => ({ ...prev, subjectError: err.response.data.detail}))
            } else {
                setErrors(prev => ({ ...prev, subjectError: "Network Error"}))
            }
        }
    }

    // Getting data for the form

    const getClass = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/classes/getById/${class_id}`)

            setFormData({
                subject_id: response.data.subject_id,
                teacher_id: response.data.teacher_id,
                name: response.data.name
            })

        } catch (err) {
            if (err.response?.data?.detail) {
                setFetchError(err.response.data.detail)
            }
        }
    }


    useEffect(() => {
        if (class_id) {
            getClass() 
            getTeachers()
            getSubjects()
        }
    }, [class_id])


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name] : value}));
    }

    const validate = () => {
        const formErrors = {};

        if (!formData.subject_id) formErrors.subject_id = "Subject Id is required!";
        if (!formData.teacher_id) formErrors.teacher_id = "Teacher Id is required";
        if (!formData.name) formErrors.name = "Class Name is required"


        return formErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors)
            return
        }

        try {
            setLoading(true);
            const response = await axios.patch(`http://localhost:8000/classes/patch/${class_id}`, {
                subject_id: formData.subject_id,
                teacher_id: formData.teacher_id,
                name: formData.name
            })

            setSuccess(`Class with class id ${response.data.id} has been updated`);
            setFetchError({});

            if (onSuccess) onSuccess();

        } catch (err) {
            if (err.response?.data?.detail) {
                setSubmitError(err.response.data.detail);
            } else {
                setSubmitError("Network Error")
            }
        } finally {
            setLoading(false);
        }
    }

    const labelClass = "text-[#102E50] font-bold opacity-75"

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">

            {success && <p className="text-green-800">{success}</p>}
            {fetchError && <p className="text-red-800">{fetchError} 1</p>}
            {submitError && <p className="text-red-800">{submitError}</p>}
            

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
                {formError && <span className="text-red-800">{formError.name}</span>}


                {errors && <span className="text-red-800">{errors.subjectError}</span>}
                <label htmlFor="subject_id" className={labelClass}>Subject:</label>
                <select id="subject_id" name="subject_id" value={formData.subject_id} onChange={handleChange} className="w-full h-[15%] bg-gray-700 rounded-md">
                    <option value="">select a subject</option>
                    {subjects.length > 0 ? (
                        subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)
                    ) : (<option disabled>Error fetching subjects</option>)}
                </select>
                {formError && <span className="text-red-800">{formError.subject_id}</span>}

                {errors && <span className="text-red-800">{errors.teacherError}</span>}
                <label htmlFor="teacher_id" className={labelClass}>Teacher:</label>
                <select id="teacher_id" name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="w-full h-[15%] bg-gray-700 rounded-md">
                    <option value="">select a teacher</option>
                    {teachers.length > 0 ? (
                        teachers.map((teacher) => <option value={teacher.id} key={teacher.id}>{teacher.first_name} {teacher.last_name}</option>)
                    ) : (<option disabled>Error fetching teachers</option>)}
                </select>
                {formError && <span className="text-red-800">{formError.teacher_id}</span>}


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
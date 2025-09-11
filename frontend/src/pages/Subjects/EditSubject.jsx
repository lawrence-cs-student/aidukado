import { useState, useEffect } from "react"
import axios from "axios";
import { MdClose } from "react-icons/md";


export default function EditSubject({ subject_id, onClose, onSuccess }) {


    const [formData, setFormData] = useState({
        name : "",
        description: ""
    })

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");


    const getSubjects = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/subject/getById/${subject_id}`, {
                params: {query : subject_id}
            })
            setFormData({
                name: response.data.name,
                description: response.data.description
            })
        } catch (err) {
            console.error("Error fetching subjects", err);
        }
    }


    useEffect(() => {
        if(subject_id) {
            getSubjects()
        }
    }, [subject_id])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}))
    }


    const validate = () => {

        const currentErrors = {};

        if(!formData.name) {currentErrors.name = "Subject Name is Required"}
        if(!formData.description) {currentErrors.description = "Subject Description is Required"}

        return currentErrors;
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const validationErrors = validate()

        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})
        setLoading(true)

        try {
            const response = await axios.patch(`http://localhost:8000/subject/update/${subject_id}`, {
                name: formData.name,
                description: formData.description
            })

            setSuccess(`Subject with subject_id: ${response.data.id} has been updated`)

            if(onSuccess) onSuccess();
        } catch (err) {
            if (err.response?.data?.detail) {
                setErrors({api : err.response.data.detail})
            } else {
                setErrors({api : "Network Error"})
            }
        } finally {
            setLoading(false)
        }

    }


    const labelClass = "text-[#102E50] font-bold opacity-75"

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">
            {errors.api && (<p>{errors.api}</p>)}
            {success && (<p>{success}</p>)}
            <MdClose size={24} color="#102E50"  className="self-end" onClick={onClose}/>
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

                <button
                  type="submit"
                  className="w-full mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95 shadow-md"
                  >
                  {loading ? "SUBMITTING..." : "SUBMIT"}
                </button>
            </form>
        </div>
    )
}
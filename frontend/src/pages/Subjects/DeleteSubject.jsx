import axios from "axios"
import { useState } from "react"


export default function DeleteSubject({ subject_id, onClose, onSuccess}) {
    

    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.delete(`http://localhost:8000/subject/delete/${subject_id}`)

            if(onSuccess) onSuccess();
        } catch (err) {
            if (err.response?.data?.detail) {
                setError(err.response.data.detail)
            } else {
                setError("Network Error")
            }
        }
    }



    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">
            {error && (<p>{error}</p>)}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-2/3 h-1/2 gap-[2%] text-left rounded-2xl"
            >
                <p className="text-[#10375C] font-bold text-xl"> ARE YOU SURE YOU WANT TO DELETE THIS SUBJECT WITH ID: {subject_id}</p>
                <div className="w-full flex gap-2">
                    <button
                        onClick={onClose}
                        type="button"
                        className="w-full mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95 shadow-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full mt-[1%] bg-[#E62727] text-white transition-transform duration-200 hover:scale-95 shadow-md"
                    >
                        Confirm
                    </button>
                </div>
                
            </form>
        </div>
    )
}
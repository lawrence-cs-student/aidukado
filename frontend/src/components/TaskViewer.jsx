import { useState } from "react";
import { MdEdit, MdDelete, MdRemoveRedEye, MdVisibilityOff } from "react-icons/md";
import FileView from "../pages/Lesson/FileView";
import FileUploader from "./FileUploader";
import useUserStore from "../store/useUserStore";
import axios from "axios";

export default function TaskViewer({fileExtension, fileUrl, title, description, setIsVisible, isVisible, materialId, materialType}) {
    
    const [file, setFile] = useState(null)

    const userId = useUserStore((state) => state.userId);

    const [metaData, setMetaData] = useState({
        materialId: materialId,
        type: materialType,
        studentId: userId,
    })

    const [uploadError, setUploadError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const maxFileSize = 5 * 1024 * 1024;
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > maxFileSize) {
            alert("File size exceeds 5 MB. Please upload a smaller file.");
            e.target.value = "";
            return;
        }
        setFile(selectedFile);
    };

    
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metaData));
    formData.append("file", file);


    const handleSubmit = async(e) => {
        e.preventDefault();

        const url = "http://localhost:8000/student_submission/upload"

        try {
            const response = await axios.post(url, formData, {
                headers: { "Content-Type" : "multipart/form-data"}
            })
            setSuccessMessage(response.data.message)
            setUploadError("");

        } catch (err) {
            if (err.response?.data?.detail) {
                setUploadError(err.response.data.detail)
            } else {
                setUploadError("Network Error")
            }
        }
    }

    return (
        <>
            {isVisible ? (
                <div className="sm:w-3/5 sm:h-auto">
                    <FileView 
                        fileExtension={fileExtension}
                        fileUrl={fileUrl}
                    />
                </div>
            ) : (
                <div className="sm:w-1/2 sm:h-auto bg-gray-800 p-3 rounded-xl">
                    <div className="w-full h-full flex flex-col sm:h-auto sm:min-h-[250px] rounded-md p-4 bg-[#F4F6FF]">
                        {uploadError && <p className="text-red-800">{uploadError}</p>}
                        <h2 className="sm:w-full font-bold text-3xl text-[#102E50]">{title}</h2>
                        <p className="sm:min-h-[20px] sm:h-auto text-lg text-[#102E50]">{description}</p>
                        <p className="text-md text-[#F5C45E]">October 10</p>
                        
                        <div className="flex w-full h-[200px] gap-4 mt-4">
                            <div className="flex flex-col gap-4 w-1/2 h-full shadow-lg">
                                 <FileUploader 
                                    type=".pdf, .doc, .docx"
                                    handleFileChange={handleFileChange}
                                 />
                                 <button 
                                    onClick={handleSubmit}
                                    className="w-full bg-[#102E50]">
                                    Submit File
                                 </button>   
                            </div>
                            <div className="w-1/2 h-full flex flex-col gap-2">
                                <button
                                    className="w-full h-1/2 bg-white text-[#BE3D2A] shadow-xl flex flex-col items-center justify-center"
                                    onClick={() => setIsVisible(true)}
                                >
                                    <MdVisibilityOff className="text-green-800" size={30} />
                                    <p className="text-[#102E50] font-bold">View Material</p>
                                </button>
                                <img
                                    className="w-1/2 h-1/2 object-contain rounded-b-lg m-auto"
                                    src="/studying.png"
                                    alt="Lesson Preview"
                                />
                            </div>
                        </div>

                    </div>   
                </div> 
            )}
        </>

    )
}
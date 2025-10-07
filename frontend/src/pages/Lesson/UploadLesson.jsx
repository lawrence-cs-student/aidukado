import FileUploader from "../../components/FileUploader"
import { useState, useEffect } from "react";
import useClassStore from "../../store/useClassStore";
import axios from "axios";

export default function UploadLesson({setIsOpen, onSuccess, term, setSuccessMessage}) {

    
    const classId = useClassStore((state) => state.classId);
    const [uploadError, setUploadError] = useState("");
    

    

    const getTermId = (termName) => {
        switch (termName) {
            case "Prelim": return 1;
            case "Midterm": return 2;
            case "Final": return 3;
            default: return null;
        }
    };

     useEffect(() => {
        setMetaData(prev => ({
            ...prev,
            termId: getTermId(term)
        }));
    }, [term]);


    const [file, setFile] = useState(null);

    const [metaData, setMetaData] = useState({
        classId: classId,
        termId: getTermId(term),
        title: "",
        description: ""
    })

    const maxFileSize = 5 * 1024* 1024;
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]

        if (selectedFile && selectedFile.size > maxFileSize) {
            alert("File size exceeds 5 MB. Please upload a smaller file.");
            e.target.value = ""
            return
        }

        setFile(selectedFile)
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please Select a File First!")
            return;
        }

         if (!metaData.title.trim()) {
            setUploadError("Please enter a title!");
            return;
        }

        if (!metaData.termId) {
            setUploadError("Invalid term selected!");
            return;
        }

        const formData = new FormData();
        formData.append("metadata", JSON.stringify(metaData));
        formData.append("file", file)

        try {
            
            const response = await axios.post("http://localhost:8000/lesson/upload", formData, {
                headers : {"Content-Type" : "multipart/form-data"}
            })

            setSuccessMessage(response.data.message);
            if (onSuccess) onSuccess();
        } catch (err) {
            if (err.response?.data?.detail) {
                setUploadError(err.response.data.detail);
            } else {
                setUploadError("Network Error");
            }
        }

    }



    const inputClass = "w-full sm:h-[6%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md";
    const labelClass = "text-[#102E50] font-bold opacity-75";
    return (
        <form className="flex flex-col justify-center w-full h-full gap-[2%] text-left rounded-2xl bg-[#F4F6FF] p-4 shadow-2xl">
            {uploadError && (<p className="text-red-800">{uploadError}</p>)}
            <FileUploader type=".pdf, .doc, .docx" handleFileChange={handleFileChange}/>
            <label className={labelClass}>
                Title
            </label>
            <input 
                className={inputClass}
                value={metaData.title}
                onChange={(e) => setMetaData((prev) => ({...prev, title: e.target.value}))}
            >

            </input>
            <label className={labelClass}>
                Term
            </label>
            <input className={inputClass} value={term} readOnly></input>
            
            <label className={labelClass}>
                Description
            </label>
            <textarea 
                className="w-full h-[20%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                value={metaData.description}
                onChange={(e) => setMetaData((prev) => ({...prev, description: e.target.value}))}
                rows={2} 
                cols={5}
            />
           <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="bg-[#9BA4B4] w-1/2" type="button">CANCEL</button>
                <button className="bg-[#102E50] w-1/2" onClick={handleUpload}>UPLOAD</button>
           </div>
        </form>
        
    )
}
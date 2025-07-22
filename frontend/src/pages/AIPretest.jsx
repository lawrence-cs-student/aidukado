import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import React, {useState} from "react";

export default function AILEARN() {

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file)

    try {
      console.log("sent")
      const response = await axios.post("http://localhost:8000/upload",formData ,{
      headers: {"Content-Type" : "multipart/form-data"}
    });
      
      setQuestions(response.data.pretest)


    } catch (error) {
      console.error("Upload error:", error)
    }
    
  };

  


  return (
    <div className="bg-[#424874] h-full w-[100%] flex flex-col items-center justify-center gap-10 ">
      <h1 className="text-4xl font-bold">Welcome to AI Test and Learn</h1>
      {questions.length > 0 ? (
        <div className="bg-white p-[1%] mt-2 rounded shadow-md w-[50%] max-h-[60vh] overflow-y-auto">
          <h2 className="text-black">Pretest:</h2>
          <pre className="whitespace-pre-wrap break-all text-black overflow-x-auto max-w-full">{JSON.parse(questions)}</pre>
        </div>
      ) : (
        <p className="text-white italic">Upload a File and Generate Pretest.</p>
      )}

      
      
      <label
        htmlFor="file-upload"
        className="cursor-pointer p-3 rounded-full bg-[#F1F2F7] text-[#424874] hover:bg-black hover:text-white"
      >
        <MdDriveFolderUpload size={30} />
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <button className="text-[#333446] bg-white font-bold" onClick={handleUpload}>Upload and Generate</button>
    </div>
  )
  
}

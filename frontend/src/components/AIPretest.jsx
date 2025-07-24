import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import React, {useState} from "react";
import PretestQuestions from "../tests/pretest";

export default function AILEARN() {

  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("")
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

      setExtractedText(response.data.extracted_text)
      setQuestions(response.data.pretest)


    } catch (error) {
      console.error("Upload error:", error)
    }
    
  };

  return (
    <div className="bg-[#424874] h-full w-[100%] flex flex-col items-center justify-center gap-5 ">

      <h1 className="text-4xl font-bold">Welcome to AI Test and Learn</h1>
      
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
      <button onClick={handleUpload}>Upload</button>
      <button className="text-[#333446] bg-white font-bold" onClick={handleUpload}>Upload and Generate</button>

      {questions && questions.length > 0 && (
      <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <PretestQuestions questions={questions} />
      </div>
    )}
    </div>
  )

}
import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import React, {useState} from "react";
import Test from "../components/Test";

export default function AIPretest() {

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleUpload = async () => {

    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file)
 
    try {
      console.log("sent")
      const response = await axios.post("http://localhost:8000/upload",formData ,{
      headers: {"Content-Type" : "multipart/form-data"}
    });
      
    console.log("Received questions:", response.data.pretest); 
    setQuestions(response.data.pretest)

    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setLoading(false)
    }
    
  };

  return (
    <div className="bg-[#424874] h-full w-[100%] flex flex-col items-center justify-center gap-10 ">
      {loading && (
        <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white text-xl font-semibold animate-pulse"> Generating Pretest... Please Wait</div>
        </div>
      )}

      {!loading && questions.length === 0 &&(
        <>
          <h1 className="text-4xl font-bold">Welcome to AI Test and Learn</h1>
          <p className="text-white italic">Upload a File and Generate Pretest.</p>
      
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
        </>
      )}

      {!loading && questions.length > 0 && (
        <div>
          <Test questions={questions} title={"Pretest Questions"} />
        </div>
      )}

    </div>
  )
   
}
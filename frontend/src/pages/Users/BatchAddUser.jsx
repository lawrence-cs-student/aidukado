import * as XLSX from "xlsx";
import { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import FileUploader from "../../components/FileUploader";

export default function BatchAddUser({onClose, onSuccess}) {

    const [rows, setRows] = useState([]);
    const [uploadError, setUploadError] = useState("");
    const [success, setSuccess] = useState("")


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            setRows(json);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        try {
            
            const transformedData = rows.map(row => ({
                firstName: row.first_name || row.firstName,
                lastName: row.last_name || row.lastName,
                middleName: row.middle_name || row.middleName,
                email: row.email,
                password: row.password,
                role: row.role || "student"
            }));
            
            const response = await axios.post(
                "http://localhost:8000/user/batch_create", 
                transformedData,
                {
                    headers: {"Content-Type": "application/json"}
                }
            );
            
            setSuccess(response.data.message);
            if (onSuccess) onSuccess();
            
        } catch (err) {
            if (err.response?.data?.detail) {
                setUploadError(err.response.data.detail);
            } else {
                setUploadError("Network Error");
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-xl space-y-4 relative">
            
            <MdClose
                size={24}
                color="#102E50"
                className="absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform"
                onClick={onClose}
            />

            
            {uploadError && <p className="text-red-600 font-medium">{uploadError}</p>}
            {success && <p className="text-green-600 font-medium">{success}</p>}

            
            <label className="text-[#102E50] font-semibold text-lg">
                Upload Excel File
            </label>

            <FileUploader type=".xlsx, .xls" handleFileChange={handleFileUpload}/>

            <button
                onClick={handleUpload}
                disabled={!rows.length}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                    rows.length
                    ? "bg-[#102E50] text-white hover:bg-[#0b223a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                Register Students
            </button>
        </div>
    )
}
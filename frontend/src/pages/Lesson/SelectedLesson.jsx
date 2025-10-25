import PdfViewer from "../../components/PdfViewer";
import FileViewer from "../../components/FileViewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import LessonViewer from "../../components/LessonViewer";
import { MdClose } from "react-icons/md";
import TaskViewer from "../../components/TaskViewer";


export default function SelectedLesson() {

    const { materialId, materialType} = useParams();

    const [lesson, setLesson] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const userRole = useUserStore((state) => state.userRole);

    const [fetchFileError, setFetchFileError] = useState("");

    const getFileUrl = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/class_material/getMaterialById/${materialId}`)

            setLesson(response.data)
            console.log(response.data)
        } catch (err) {
            if (err.response?.data?.detail) {
                setFetchFileError(err.response.data.detail)
            } else {
                setFetchFileError("Network Error")
            }
        }
    }

    useEffect(() => {
        getFileUrl();
    }, [materialId])

    
    const fileUrl = lesson?.fileUrl || "";
    const title = lesson?.title || "";
    const description = lesson?.description || "";
    const fileKey = lesson?.fileKey || "";
    const fileExtension = fileKey.split(".").pop().toLowerCase();
    const lessonType = lesson?.type || "";
    

    return (
        <div className="w-full h-full flex flex-col sm:p-[3%] gap-[2%] items-center">
            {isVisible && (
                <div className="w-[30px] h-[30px] bg-[#BE3D2A] flex" onClick={() => setIsVisible(false)}>
                    <MdClose size={24} className="text-white font-bold m-auto" />
                </div>
            )}
            {lessonType == "lesson" && (
                <LessonViewer 
                    fileExtension={fileExtension}
                    fileUrl={fileUrl}
                    title={title}
                    description={description}
                    setIsVisible={setIsVisible}
                    isVisible={isVisible}
                />
            )}
            {lessonType != "lesson" && (
                <TaskViewer 
                    materialId={materialId}
                    materialType={materialType}
                    fileExtension={fileExtension}
                    fileUrl={fileUrl}
                    title={title}
                    description={description}
                    setIsVisible={setIsVisible}
                    isVisible={isVisible}
                />
            )}
            
        </div>
    )
}


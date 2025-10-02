
import { useNavigate} from "react-router-dom"

export default function LessonCard ({lessonName}) {

    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate("/selectedLesson")
    }
    
    return (
        <div 
            className="w-3/4 sm:w-[30%] sm:min-h-[100px] shadow-2xl rounded p-1 text-[#F4F6FF] 
            bg-gray-200 text-xl font-bold rounded-xl hover:bg-violet-600 transition-colors duration-100 ease-in-out" 
            onClick={handleClick}
        > 
            <div className="w-3/4 sm:w-full sm:h-full rounded p-2 text-[#F4F6FF] bg-[#102E50] text-xl font-bold " > 
                {lessonName} 
            </div>
        </div>
    )
}
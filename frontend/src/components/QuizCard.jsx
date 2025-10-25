import { useNavigate} from "react-router-dom"
import { MdTaskAlt} from "react-icons/md";

export default function QuizCard ({quizId, lessonTitle, quizTitle, createdAt}) {

    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/studentQuizPage/${quizId}`)
    }

    const date = new Date(createdAt);
    console.log("Date", createdAt)

    const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",  
    day: "numeric", 
    
    });
    
    return (
        <div 
            className="flex flex-col w-full max-w-sm p-5 gap-4
                    rounded-md cursor-pointer shadow-sm hover:shadow-md
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.01]
                    relative overflow-hidden"
            style={{ backgroundColor: 'rgba(158, 198, 243, 0.2)' }}
            onClick={handleClick}
        > 
            <h1 className="text-md font-semibold text-gray-800 h-2/3">{quizTitle}</h1>
            <h2 className="text-md font-semibold text-gray-800 h-2/3">{lessonTitle}</h2>
            <div className="flex h-1/3 justify-between">
                <p className="w-4/5 text-sm font-semibold text-gray-800">{formattedDate}</p>
            </div>

            <div className="absolute bottom-2 right-2 flex bg-[#9BA4B4] w-10 h-10 rounded-full p-1 items-center justify-center">
                <MdTaskAlt size={24} className="text-blue" />
            </div>
        </div>
    )
}
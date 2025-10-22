
import { useNavigate} from "react-router-dom"
import { MdMenuBook, MdAssignment, MdTaskAlt, MdWorkOutline } from "react-icons/md";

export default function LessonCard ({materialName, materialId, creationDate, materialType}) {

    
    const date = new Date(creationDate);

    const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",  
    day: "numeric", 
    
    });


    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/selectedLesson/${materialId}`)
    }

    const iconStyle = "text-[#102E50] m-auto"
    const returnIcon = (type) => {
        switch (type) {
            case "lesson":
                return <MdMenuBook size={30} className={iconStyle}/>;
            case "assignment":
                return <MdAssignment size={24} className={iconStyle}/>;
            case "activity":
                return <MdTaskAlt size={24} className={iconStyle}/>;
            case "project":
                return <MdWorkOutline size={24} className={iconStyle}/>;
            default:
                return <MdMenuBook size={24} className={iconStyle}/>; // fallback icon
        }
    };
    
    return (
        <div 
            className="flex flex-col w-full max-w-sm p-5 gap-2
                    rounded-md cursor-pointer shadow-sm hover:shadow-md
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.01]
                    relative overflow-hidden"
            style={{ backgroundColor: 'rgba(158, 198, 243, 0.2)' }}
            onClick={handleClick}
        >
            <h2 className="text-md font-semibold text-gray-800 h-2/3">{materialName}</h2>
            <div className="flex h-1/3 justify-between">
                <p className="w-4/5 text-sm font-semibold text-gray-800">{formattedDate}</p>
                <div className="flex bg-[#9BA4B4] w-10 h-10 rounded-full p-1">
                    {returnIcon(materialType)}
                </div>
            </div>
            
      </div>
            
    )
}
import { useNavigate } from "react-router-dom"
import useClassStore from "../store/useClassStore"
import { getTermName } from "../utils/getTermName";

export default function Term({term}) {

    const classId = useClassStore((state) => state.classId);
    
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/selectedClass/${classId}/${term}`)
    }

    
    let termName = getTermName(term)

    return (
        <div 
            className="w-[25%] h-[20%] sm:h-[50%] rounded-xl shadow-xl bg-[#102E50] flex hover:scale-95 transition-transform duration-300"
            onClick={handleClick}
        >
            <p className="text-red-800">{classId}</p>
            <h2 className="mx-auto my-auto font-bold text-3xl">{termName}</h2>
        </div>
    )
}
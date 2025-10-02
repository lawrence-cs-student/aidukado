import { useNavigate } from "react-router-dom"
import useClassStore from "../store/useClassStore"


export default function Term({term}) {

    // const classId = useClassStore((state) => state.classId);
    const classId = 1;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/selectedClass/${classId}/${term}`)
    }

    return (
        <div 
            className="w-[25%] h-[20%] sm:h-[50%] rounded-xl shadow-xl bg-[#102E50] flex hover:scale-95 transition-transform duration-300"
            onClick={handleClick}
        >
            <h2 className="mx-auto my-auto font-bold text-3xl">{term}</h2>
        </div>
    )
}
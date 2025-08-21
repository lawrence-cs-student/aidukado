import SubjectCard from "../components/SubjectCard"
import { useNavigate } from "react-router-dom"

export default function StudentArea() {

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/selectedSubject")
    }

    return (
        <div className="w-full h-full flex flex-col gap-[10%] p-[2%]">
            <button className="w-[10%] font-bold bg-[#F5C45E] transition-transform duration-300 hover:scale-95">Create a Class</button>
            
            <div className="flex w-full h-[95%] gap-[2%]">
                <SubjectCard onClick={handleNavigate}/>
                <SubjectCard onClick={handleNavigate}/>
                <SubjectCard onClick={handleNavigate}/>
                <SubjectCard onClick={handleNavigate}/>
            </div>
        </div>
    )
}
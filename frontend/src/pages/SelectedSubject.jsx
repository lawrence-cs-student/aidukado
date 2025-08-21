
import LessonCard from "../components/LessonCard"

export default function SelectedSubject() {
    return (
        <div className="w-full h-full flex flex-col justify-content items-center gap-[2%] p-[2%]">
            <div className="h-[25%] w-3/5 bg-[#102E50] flex flex-col gap-[5%] rounded-xl p-[2%]">
                <h1>Programming Languages</h1>
                <h2>IV-CS1</h2>
            </div>
            <LessonCard />
            <LessonCard />
            <LessonCard />
        </div>
    )
}
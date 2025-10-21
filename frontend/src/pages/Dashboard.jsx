import FileUploader from "../components/FileUploader"
import UploadLesson from "./Lesson/UploadLesson"
import LessonCard from "../components/LessonCard"
export default function Dashboard() {

  const lessonName = "Agile"
  return (
    <div className="w-full h-full">
      <LessonCard lessonName={lessonName}/>
    </div>
  )
}

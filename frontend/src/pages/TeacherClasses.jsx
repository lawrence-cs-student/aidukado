
import { useEffect, useState } from "react"
import axios from 'axios'
import ClassCard from "../components/ClassCard";
// import useUserStore from "../store/useUserStore.js";

export default function StudentClasses() {

  // const teacherId = useUserStore((state) => state.userId)

  const teacherId = 5;

  

  const [classes, setClasses] = useState([])
  

  useEffect(() => {
    if(!teacherId) return

    const getClasses = async () => {
      try{
        const response = await axios.get(`http://localhost:8000/classes/getByUserId/${teacherId}`)
        setClasses(response.data)
      }catch(error){
        console.error("Error fetching classes ", error)
      }
    }
    getClasses() 
  }, [teacherId]) 

  return (
    <main className="flex flex-col p-[2%]">
        <h1 className="text-4xl font-bold text-[#424874] mb-4">All Your Classes in One Place</h1>
        
        {classes.length > 0 ? (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {classes.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    subjectName={cls.name} 
                    teacher={
                      cls.userTeacher
                        ? `${cls.userTeacher.firstName} ${cls.userTeacher.lastName}`
                        : "Unknown Teacher"
                    }
                    classId={cls.id}
                  />
              ))}
            </div>
            ) : (
                <p>No classes enrolled</p>
            )}
    </main>
  )
}
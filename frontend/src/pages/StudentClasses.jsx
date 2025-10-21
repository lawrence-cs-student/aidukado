
import { useEffect, useState } from "react"
import axios from 'axios'
import ClassCardStudent from "../components/ClassCardStudent";

export default function StudentClasses() {
  const userId = 1;
  

  const [classes, setClasses] = useState([
  ])
  

  useEffect(() => {
    if(!userId) return

    const getClasses = async () => {
      try{
        const response = await axios.get(`http://localhost:8000/enrollment/getByUserId/${userId}`)
        setClasses(response.data);
        console.log(response.data)
      }catch(error){
        console.error("Error fetching classes ", error)
      }
    }
    getClasses() 
  }, [userId]) 

  return (
    <main className="flex flex-col p-[2%]">
        <h1 className="text-4xl font-bold text-[#424874] mb-4">All Your Classes in One Place</h1>
          
        {classes.length > 0 ? (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {classes.map((cls) => (
                  <ClassCardStudent
                    key={cls.id}
                    subjectName={cls.enrolledClass.name} 
                    teacher={
                      cls.enrolledClass.userTeacher
                        ? `${cls.enrolledClass.userTeacher.firstName} ${cls.enrolledClass.userTeacher.lastName}`
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
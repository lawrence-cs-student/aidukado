
import { useEffect, useState } from "react"
import axios from 'axios'
import ClassCard from "../components/ClassCard";
import useUserStore from "../store/useUserStore.jsx";

export default function StudentClasses() {

  // const teacherId = useUserStore((state) => state.userId)

  const teacherId = 2;

  const classes = [
    {
      id: 1,
      name: "Programming",
      userTeacher: { firstName: "Alice", lastName: "Johnson" }
    },
    {
      id: 2,
      name: "Data Structures",
      userTeacher: { firstName: "Bob", lastName: "Smith" }
    },
    {
      id: 3,
      name: "Database Systems",
      userTeacher: null // to test the "Unknown Teacher"
    },
  ];

  // const [classes, setClasses] = useState([])
  

  // useEffect(() => {
  //   if(!teacherId) return

  //   const getClasses = async () => {
  //     try{
  //       const response = await axios.get(`http://localhost:8000/classes/getByUserId/${teacherId}`)
  //       setClasses(response.data)
  //     }catch(error){
  //       console.error("Error fetching classes ", error)
  //     }
  //   }
  //   getClasses() 
  // }, [teacherId]) 

  return (
    <main className="flex flex-col p-[2%]">
        <h1 className="text-4xl font-bold text-[#424874] mb-4">Welcome to Dashboard</h1>
        
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
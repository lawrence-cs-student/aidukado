
import { useEffect, useState } from "react"
import axios from 'axios'
import ClassCard from "../components/ClassCard";

export default function StudentClasses() {
  // const userId = 1;
  // fake data
  const classes = [
    {
      id: 1,
      enrolledClass: {
        id: 101,
        name: "Mathematics",
        user_teacher: {
          id: 11,
          firstName: "Alice",
          lastName: "Johnson",
        },
      },
    },
    {
      id: 2,
      enrolledClass: {
        id: 102,
        name: "Science",
        user_teacher: {
          id: 12,
          firstName: "Bob",
          lastName: "Smith",
        },
      },
    },
    {
      id: 3,
      enrolledClass: {
        id: 103,
        name: "History",
        user_teacher: {
          id: 13,
          firstName: "Charlie",
          lastName: "Brown",
        },
      },
    },
  ];

  // const [classes, setClasses] = useState([
  // ])
  

  // useEffect(() => {
  //   if(!userId) return

  //   const getClasses = async () => {
  //     try{
  //       const response = await axios.get(`http://localhost:8000/enrollment/getByUserId/${userId}`)
  //       setClasses(response.data)
  //     }catch(error){
  //       console.error("Error fetching classes ", error)
  //     }
  //   }
  //   getClasses() 
  // }, [userId]) 

  return (
    <main className="flex flex-col p-[2%]">
        <h1 className="text-4xl font-bold text-[#424874] mb-4">Welcome to Dashboard</h1>
        
        {classes.length > 0 ? (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {classes.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    subjectName={cls.enrolledClass.name} 
                    teacher={cls.enrolledClass.user_teacher} 
                  />
              ))}
            </div>
            ) : (
                <p>No classes enrolled</p>
            )}
    </main>
    )
    }
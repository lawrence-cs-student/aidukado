import React from "react";
import {
  MdMenuBook,
  MdAnalytics,
  MdBarChart,
  MdAccountCircle,
  MdContactSupport,
  MdExitToApp,
  MdAssignmentInd,
  MdClass,

} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import axios from "axios";


export default function Sidebar() {

  const userRole = useUserStore((state) => state.userRole)
  const clearUserRole = useUserStore((state) => state.clearUser)
  // const userRole = "admin";
  const navigate = useNavigate();

  
  
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-2 py-1 rounded ${
      isActive ? "bg-[#102E50] text-white" : "text-[#102E50]"
    }`;

  const handleLogout = async () => {
    clearUserRole();
    try {
      const response = await axios.post("http://localhost:8000/logout",
      {},
      {withCredentials: true}
    )

      if(response.data.message === "logged out successfully") {
        navigate("/login")
      }
    } catch (err) {
      console.error("Logout Failed", err)
    }
  }

  return (
    <div className="hidden md:block h-full w-[15%] min-w-[15%] bg-[#F1F2F7]">
      <div className="flex space-x-3 p-[15%]">
        <div className="rounded-full h-[30px] w-[30px] bg-[#102E50] flex justify-center items-center font-bold text-white">
          A
        </div>
        <h1 className="text-[#102E50] font-bold text-2xl">AIDUKADO</h1>
      </div>

      <div className="flex flex-col space-y-4 mt-10 mb-15 p-[15%]">
        <h2 className="text-[#45495E] font-semibold opacity-75">Menu</h2>

        {/* For Admin */}

        {/* {userRole == "admin" && (
          <NavLink to="/admin" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">Dashboard(A)</h2>
          </NavLink>
        )} */}

        <NavLink to="/dashboard" className={linkClasses}>
          <MdAnalytics size={32} />
          <h2 className="font-bold">Dashboard</h2>
        </NavLink>


        {userRole == "admin" && (
          <NavLink to="/userManagement" className={linkClasses}>
            <MdAccountCircle size={32} />
            <h2 className="font-bold">User Management</h2>
          </NavLink>
        )}

        {userRole == "admin" && (
          <NavLink to="/enrollmentManagement" className={linkClasses}>
            <MdAssignmentInd size={32} />
            <h2 className="font-bold">Enrollment Management</h2>
          </NavLink>
        )}

        {userRole == "admin" && (
          <NavLink to="/classManagement" className={linkClasses}>
            <MdClass size={32} />
            <h2 className="font-bold">Class Management</h2>
          </NavLink>
        )}

        {userRole == "admin" && (
          <NavLink to="/subjectManagement" className={linkClasses}>
            <MdMenuBook size={32} />
            <h2 className="font-bold">Subject Management</h2>
          </NavLink>
        )}

        

        {/* {userRole == "student" && (
          <NavLink to="/subjects" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">StudentArea</h2>
          </NavLink>
        )}  */}

        

        <NavLink to="/aipretest" className={linkClasses}>
          <MdMenuBook size={32} />
          <h2 className="font-bold">AI Test & Learn</h2>
        </NavLink>

        {userRole == "student" && (
          <NavLink to="/studentClasses" className={linkClasses}>
            <MdBarChart size={32} />
            <h2 className="font-bold">My Classes</h2>
          </NavLink>
        )}

        {userRole == "teacher" && (
          <NavLink to="/teacherClasses" className={linkClasses}>
            <MdBarChart size={32} />
            <h2 className="font-bold">My Classes</h2>
          </NavLink>
        )}

      </div>

      <div className="flex flex-col space-y-4 p-[15%]">
        <h2 className="text-[#45495E] font-semibold opacity-75">Others</h2>


        <NavLink to="/help" className={linkClasses}>
          <MdContactSupport size={32} />
          <h2 className="font-bold">Help</h2>
        </NavLink>



        <button onClick={handleLogout} className="flex p-1 gap-2 bg-transparent">
          <MdExitToApp size={32} color="#102E50"/>
          <h2 className="font-bold text-[#102E50]">Logout</h2>
        </button>
        
      </div>
    </div>
  );
}

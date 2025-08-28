import React from "react";
import {
  MdMenuBook,
  MdAnalytics,
  MdBarChart,
  MdAccountCircle,
  MdContactSupport,
  MdLogout,

} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
// import useUserRoleStore from "../store/storeUserRole";
import axios from "axios";


export default function Sidebar() {


  const userRole = "admin";
  const navigate = useNavigate();
  // RBAC dont clear
  // const userRole = useUserRoleStore((state) => (state.userRole))
  // const clearUserRole = useUserRoleStore((state => (state.clearUserRole)))
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-2 py-1 rounded ${
      isActive ? "bg-[#102E50] text-white" : "text-[#102E50]"
    }`;

  const handleLogout = async () => {
    // clearUserRole();
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
    <div className="h-full w-[15%] min-w-[15%] bg-[#F1F2F7]">
      <div className="flex space-x-3 p-[15%]">
        <div className="rounded-full h-[30px] w-[30px] bg-[#102E50] flex justify-center items-center font-bold text-white">
          A
        </div>
        <h1 className="text-[#102E50] font-bold text-2xl">AIDUKADO</h1>
      </div>

      <div className="flex flex-col space-y-4 mt-10 mb-15 p-[15%]">
        <h2 className="text-[#45495E] font-semibold opacity-75">Menu</h2>

        {/* For Admin */}

        {userRole == "admin" && (
          <NavLink to="/admin" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">Dashboard(A)</h2>
          </NavLink>
        )}

        {userRole == "admin" && (
          <NavLink to="/userManagement" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">User Management</h2>
          </NavLink>
        )}

        {userRole == "admin" && (
          <NavLink to="/settings" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">Settings</h2>
          </NavLink>
        )}



        {/* <NavLink to="/dashboard" className={linkClasses}>
          <MdAnalytics size={32} />
          <h2 className="font-bold">Dashboard</h2>
        </NavLink> */}

        

        {userRole == "student" && (
          <NavLink to="/subjects" className={linkClasses}>
            <MdAnalytics size={32} />
            <h2 className="font-bold">StudentArea</h2>
          </NavLink>
        )} 

        

        {/* <NavLink to="/aipretest" className={linkClasses}>
          <MdMenuBook size={32} />
          <h2 className="font-bold">AI Test & Learn</h2>
        </NavLink> */}

        {userRole == "student" && (
          <NavLink to="/performance" className={linkClasses}>
            <MdBarChart size={32} />
            <h2 className="font-bold">My Performance</h2>
          </NavLink>
        )}
      </div>

      <div className="flex flex-col space-y-4 p-[15%]">
        <h2 className="text-[#45495E] font-semibold opacity-75">Others</h2>

        <NavLink to="/accounts" className={linkClasses}>
          <MdAccountCircle size={32} />
          <h2 className="font-bold">Accounts</h2>
        </NavLink>

        <NavLink to="/help" className={linkClasses}>
          <MdContactSupport size={32} />
          <h2 className="font-bold">Help</h2>
        </NavLink>

        <button onClick={handleLogout} className="flex p-1 gap-2 bg-transparent">
          <MdLogout size={32} color="#45495E" />
          <h2 className="font-bold text-[#45495E]">Logout</h2>
        </button>
        
      </div>
    </div>
  );
}

import React from "react";
import {
  MdMenuBook,
  MdAnalytics,
  MdBarChart,
  MdAccountCircle,
  MdContactSupport,
} from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-2 py-1 rounded ${
      isActive ? "bg-[#45495E] text-white" : "text-[#45495E]"
    }`;

  return (
    <div className="h-full w-[15%] min-w-[15%] bg-[#F1F2F7]">
      <div className="flex space-x-3 p-[15%]">
        <div className="rounded-full h-[30px] w-[30px] bg-[#45495E] flex justify-center items-center font-bold text-white">
          A
        </div>
        <h1 className="text-[#45495E] font-bold text-2xl">AIDUKADO</h1>
      </div>

      <div className="flex flex-col space-y-4 mt-10 mb-15 p-[15%]">
        <h2 className="text-[#45495E] font-semibold opacity-75">Menu</h2>

        <NavLink to="/dashboard" className={linkClasses}>
          <MdAnalytics size={32} />
          <h2 className="font-bold">Dashboard</h2>
        </NavLink>

        <NavLink to="/aipretest" className={linkClasses}>
          <MdMenuBook size={32} />
          <h2 className="font-bold">AI Test & Learn</h2>
        </NavLink>

        <NavLink to="/performance" className={linkClasses}>
          <MdBarChart size={32} />
          <h2 className="font-bold">My Performance</h2>
        </NavLink>
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
        

        
        
      </div>
    </div>
  );
}

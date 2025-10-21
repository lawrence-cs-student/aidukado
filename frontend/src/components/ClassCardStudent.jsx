
import React from "react";
import { useNavigate } from "react-router-dom";
import useClassStore from "../store/useClassStore";

export default function ClassCardStudent({ subjectName, classId, teacher}) {
  const navigate = useNavigate();

  const storeClassId = useClassStore((state) => state.storeClassId)

  const handleClick = (e) => {
    e.preventDefault();
    storeClassId(classId);
    navigate(`/termPage`);
  }

  return (
    <div 
      className="
        flex flex-col
        w-3/4 sm:w-[20%] 
        sm:min-h-[120px] 
        rounded-2xl p-1
        hover:shadow-lg hover:scale-105 transition-transform duration-300
        bg-gray-200 truncate
      "
      onClick={handleClick}
    >
        <div className="flex flex-col w-full h-full rounded-2xl p-2 bg-[#102E50]">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">{subjectName}</p> 
            <p className="text-sm text-[#F5C45E]">{teacher}</p> 
          </div>
        </div>
    </div>
  );
}

import { NavLink} from "react-router-dom";
import { MdMenuBook, MdClass, MdHowToReg } from 'react-icons/md';


export default function Navbar() {

    const navStyle = 'w-14 h-14 rounded-full flex flex-col justify-center items-center hover:bg-[#10375C] '
    const iconClasses = ({isActive}) => `text-2xl  ${isActive ? "text-[#F5C45E]" : "text-white"}`
    return (
        <nav className="w-1/6 h-[6%] bg-[#10375C] flex justify-between items-center rounded-3xl p-[0.3%]">
            <NavLink to="/subjectManagement" className={navStyle}>
                {({isActive}) => <MdMenuBook className={iconClasses({isActive})}/>}
            </NavLink>
            <NavLink to="/classManagement" className={navStyle}>
                {({isActive}) => <MdClass className={iconClasses({isActive})}/>}
            </NavLink>
            <NavLink to="/enrollmentManagement" className={navStyle}>
                {({isActive}) => <MdHowToReg className={iconClasses({isActive})}/>}
            </NavLink>
            
        </nav>
        
    )
}
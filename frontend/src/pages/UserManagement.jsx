import { useEffect, useState} from "react"
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "../components/Modal";
import Signup from "../components/Signup";
import DeleteUser from "../components/DeleteUser";

export default function UserManagement() {

    const tableDataStyle = "px-4 py-2 text-[#102E50]"

    // for the tablee
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    // for modal

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserID] = useState(null);

    const getUsers = async() => {
        try {
            const response = await axios.get("http://localhost:8000/user/get", {
                params : query.trim() !== "" ? { query } : {}
            })
            setUsers(response.data)
        } catch(err) {
            console.error("Error fetching users: ", err)
        }
    }
    // reading the users with delaydebouncee
    useEffect(() => {
       const delayDebounce = setTimeout(() => {
        getUsers();
       }, 500)

       return () => clearTimeout(delayDebounce);
    }, [query]);


    // Styles fpr the modal

    const panelStyleAdd = "w-full h-2/3 max-w-lg rounded-xl shadow-xl rounded-xl"
    const panelStyleDelete = "w-full h-1/3 max-w-lg rounded-xl shadow-xl rounded-xl"

    return (
        <div className="flex flex-col w-full h-screen gap-[2%] p-[2%] items-center">
            <div className="w-4/5 h-[5%] flex justify-end items-end gap-2">
                
                <form className="w-2/5 h-full">
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
                        Search
                    </label>
                    <div className="relative h-full">
                    
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                            stroke="currentColor"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        </div>

                    
                        <input
                            type="search"
                            className="block w-full h-full pl-10 text-md text-gray-900 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                            placeholder="Search..."
                            required
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>
                <button className=" bg-[#102E50] shadow-md" onClick={() => (setIsOpen(true))}>+ Add User</button>
            </div>

            <div className="overflow-x-auto w-4/5">
                <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-[#10375C] text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">First Name</th>
                            <th className="px-4 py-2 text-left">Last Name</th>
                            <th className="px-4 py-2 text-left">Middle Name</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length !== 0 ? (
                            users.map ((user) => (
                            <tr className="border-b hover:bg-gray-100" key={user.id}>
                                <td className={tableDataStyle}>{user.id}</td>
                                <td className={tableDataStyle}>{user.email}</td>
                                <td className={tableDataStyle}>{user.role}</td>
                                <td className={tableDataStyle}>{user.first_name}</td>
                                <td className={tableDataStyle}>{user.last_name}</td>
                                <td className={tableDataStyle}>{user.middlename}</td>
                                <td className={tableDataStyle}>
                                    <div className="w-full h-full flex">
                                        <MdEdit size={24} color="#F5C45E"/>
                                        <MdDelete size={24} color="red" 
                                        onClick={ () => {
                                            setSelectedUserID(user.id);
                                            setIsOpenDeleteModal(true);
                                        }
                                        }
                                        />
                                        
                                    </div>
                                </td>
                            </tr>
                            
                        ))
                        ) : 
                            <tr className="border-b hover:bg-gray-100">
                                <td className={tableDataStyle}>No User</td>
                            </tr>
                        }

                            
                    </tbody>
                </table>
            </div>
            
            {/* Modal for creating user */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User" panelStyle={panelStyleAdd}>
                <Signup 
                    onSuccess={() => {
                        getUsers(); 
                        setIsOpen(false);
                    }}
                    onClose={() => setIsOpen(false) }
                />
            </Modal>

            {/* Modal for deleting user */}

            <Modal isOpen={isOpenDeleteModal} onClose={() => setIsOpenDeleteModal(false)} panelStyle={panelStyleDelete}>
                <DeleteUser 
                    onClose={() => setIsOpenDeleteModal(false)} 
                    userId = {selectedUserId}
                    onSuccess={() => {
                        getUsers();
                        setIsOpenDeleteModal(false);
                    }
                        
                    }
                />
            </Modal>
        </div>
    )
}
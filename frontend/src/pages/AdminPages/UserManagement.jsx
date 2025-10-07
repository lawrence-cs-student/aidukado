import { useEffect, useState} from "react"
import axios from "axios";
import Modal from "../../components/Modal";
import AddUser from "../Users/AddUser";
import BatchAddUser from "../Users/BatchAddUser";
import DeleteUser from "../Users/DeleteUser";
import EditUser from "../Users/EditUser";
import Table from "../../components/Table"
import SearchForm from "../../components/SearchForm";
import { MoonLoader } from "react-spinners";


export default function UserManagement() {

    const classesColumns = [
    { id: 1, name: "ID", key: "id" },
    { id: 2, name: "Email", key: "email" },
    { id: 3, name: "Role", key: "role" },
    { id: 4, name: "FirstName", key: "firstName" },
    { id: 5, name: "LastName", key: "lastName" },
    { id: 6, name: "MiddleName", key: "middleName" }
  ];

    // for the tablee
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    
    const [fetchingError, setFetchtingError] = useState("");

    // for modal

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal]  = useState(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenBatchModal, setIsOpenBatchModal] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);

    const getUsers = async() => {
        try {
            setLoading(true)
            const response = await axios.get("http://localhost:8000/user/get", {
                params : query.trim() !== "" ? { query } : {}
            })
            setUsers(response.data)
        } catch(err) {
            if (err.response?.data?.detail) {
                setFetchtingError(err.response.data.detail);
            } else {
                setFetchtingError("Network Error");
            }
        } finally{
            setLoading(false);
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

    const panelStyleAdd = "w-full h-2/3 max-w-lg rounded-xl shadow-xl"
    const panelStyleDelete = "w-full h-1/3 max-w-lg rounded-xl shadow-xl"
    const panelStyleEdit = "w-full h-2/3 max-w-lg rounded-xl shadow-xl"
    const panelStyleAddBatch = "w-full h-1/3 max-w-lg rounded-xl shadow-xl"

    return (
        <div className="flex flex-col w-full h-screen gap-[2%] p-[2%] items-center">
            <div className="w-4/5 h-[5%] flex justify-end items-end gap-2">
                
                <SearchForm query={query} setQuery={setQuery} inputPlaceholder="Search by email or name"/>
                <button className=" bg-[#102E50] shadow-md" onClick={() => (setIsOpen(true))}>+ Add User</button>
                <button className=" bg-[#102E50] shadow-md" onClick={() => (setIsOpenBatchModal(true))}>+ Upload Users</button>
            </div>

            <div className="overflow-x-auto w-4/5">
                {fetchingError && <p className="text-red-800">{fetchingError}</p>}
                {!loading ? (
                <Table
                    columns={classesColumns}
                    data={users}
                    setSelectedData={setSelectedUserData}
                    setIsOpenEditModal={setIsOpenEditModal}
                    setIsOpenDeleteModal={setIsOpenDeleteModal}
                />
                ) : (
                <MoonLoader color="blue" loading={true} size={80} />
                )}
            </div>
            
            {/* Modal for creating user */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User" panelStyle={panelStyleAdd}>
                <AddUser
                    onSuccess={() => {
                        getUsers(); 
                        setIsOpen(false);
                    }}
                    onClose={() => setIsOpen(false) }
                />
            </Modal>

            {/* Modal for editing a user */}

            <Modal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} title="Edit User" panelStyle={panelStyleEdit}>
                <EditUser 
                    onClose={() => setIsOpenEditModal(false)}
                    userId = {selectedUserData?.id}
                    onSuccess={() => {
                        getUsers();
                        setIsOpenEditModal(false);
                    }}
                />
            </Modal>

            {/* Modal for deleting a user */}

            <Modal isOpen={isOpenDeleteModal} onClose={() => setIsOpenDeleteModal(false)} panelStyle={panelStyleDelete}>
                <DeleteUser 
                    userId = {selectedUserData?.id}
                    onClose={() => setIsOpenDeleteModal(false)}
                    onSuccess={() => {
                        getUsers();
                        setIsOpenDeleteModal(false);
                    }
                        
                    }
                />
            </Modal>
            
            {/* Modal for excel registration */}
            <Modal isOpen={isOpenBatchModal} onClose={() => setIsOpenBatchModal(false)} title="Register" panelStyle={panelStyleAddBatch}>
                <BatchAddUser
                        onClose={() => setIsOpenBatchModal(false)}
                        onSuccess={() => {
                            getUsers();
                            setIsOpenBatchModal(false);
                        }}
                />
            </Modal>
        </div>
    )
}
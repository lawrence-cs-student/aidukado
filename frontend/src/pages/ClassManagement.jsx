
import SearchForm from "../components/SearchForm"
import Table from "../components/Table"
import { useState, useEffect } from "react"
import axios from "axios";
import Modal from "../components/Modal";
import AddClass from "./SchoolClasses/AddClass";
import { MoonLoader } from "react-spinners";
 

export default function ClassManagement() {

    const classesColumns = [
        {id: 1, name: "ID", key: "id"},
        {id: 2, name: "Name", key: "name"},
        {id: 3, name: "Subject Id", key: "subjectId"},
        {id: 4, name: "Teacher Id", key: "teacherId"}
    ];


    const [query, setQuery] = useState("");
    const [classesData, setClassesData] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedUserId, setSelectedUserId] = useState("");
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [isEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);


    const getClasses = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/classes/get", {
                params : query.trim() !== "" ? {query} : {}
            })
            setClassesData(response.data);
        } catch(err) {
            if (err.response?.data?.detail) {
                setError(err.response.data.detail)
            } else {
                setError("Network Error")
            } 
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getClasses();
        }, 500)
        return () => clearTimeout(delayDebounce)
    }, [query])

    
    const panelStyleAdd = "w-full h-2/5 max-w-lg rounded-xl shadow-xl rounded-xl"

    return (
        <div className="flex flex-col w-full h-screen gap-[2%] p-[2%] items-center">
            <div className="w-1/2 h-[5%] flex justify-end items-end gap-2">
                <SearchForm query={query} setQuery={setQuery} />
                <button className=" bg-[#102E50] shadow-md" onClick={() => (setIsOpenAddModal(true))}>+ Add Class</button>
            </div>
            <div className="w-1/2 flex flex-col justify-center items-center">
                {error && <p className="text-red-800">{error}</p>}
                {!loading ? (
                    <Table 
                        columns={classesColumns}
                        data={classesData}
                        setSelectedUserId={setSelectedUserId}
                        setIsOpenEditModal={setIsOpenEditModal}
                        setIsOpenDeleteModal={setIsOpenDeleteModal}
                    />
                ) : (                   
                    (<MoonLoader color="blue" loading={true} size={80} />)
                )}
            </div>

            {/* Modal for adding a class :> */}

            <Modal isOpen={isOpenAddModal} onClose={() => setIsOpenAddModal(false)} title="Add Class" panelStyle={panelStyleAdd}>
                <AddClass 
                    onClose={() => setIsOpenAddModal(false)}
                    onSuccess={() => {
                        getClasses();
                        setIsOpenAddModal(false);
                    }}
                />
            </Modal>

            

            
        </div>


        
    )
}
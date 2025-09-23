
import Table from "../../components/Table"
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import SearchForm from "../../components/SearchForm";
import AddSubject from "../Subjects/AddSubject";
import EditSubject from "../Subjects/EditSubject";
import DeleteSubject from "../Subjects/DeleteSubject";
import MoonLoader from "react-spinners/MoonLoader";



export default function SubjectManagement() {
    
    const subjectColumns = [
        {id: 1, name: "ID", key: "id"},
        {id: 2, name: "Name", key: "name"},
        {id: 3, name: "Description", key: "description"}
    ];

    const [query, setQuery] = useState("");
    const [subjectData, setSubjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectedSubjectData, setSelectedSubjectData] = useState(null);


    const getSubjects = async () => {
        try {
            setLoading(true)
            const response = await axios.get("http://localhost:8000/subject/get", {
                params: query.trim() !== "" ? {query} : {}
            })
            setSubjectData(response.data);
        } catch (err) {
            console.error("Error fetching subjects", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getSubjects();
        }, 500)
        return () => clearTimeout(delayDebounce);
    }, [query])


    const panelStyleAdd = "w-full h-1/3 max-w-lg rounded-xl shadow-xl"
    const panelStyleDelete = "w-full h-1/3 max-w-lg rounded-xl shadow-xl"

    return (
        <div className="flex flex-col w-full h-screen gap-[2%] p-[2%] items-center">
            <div className="w-1/2 h-[5%] flex justify-end items-end gap-2">
                <SearchForm query={query} setQuery={setQuery} inputPlaceholder="Search by subject name"/>
                <button className=" bg-[#102E50] shadow-md" onClick={() => (setIsOpen(true))}>+ Add Subject</button>
            </div>
            <div className="w-1/2 flex justify-center items-center">
                {!loading ? (
                    <Table 
                        data={subjectData} 
                        columns={subjectColumns} 
                        setSelectedData={setSelectedSubjectData} 
                        setIsOpenEditModal={setIsOpenEditModal}
                        setIsOpenDeleteModal={setIsOpenDeleteModal}
                    />
                ) : (<MoonLoader color="blue" loading={true} size={80} />)
                }
            </div>


            {/* Add Modal */}
            <Modal isOpen= {isOpen} onClose= {() => setIsOpen(false)} title="Add Subject" panelStyle = {panelStyleAdd}>
                <AddSubject
                    onSuccess={() => {
                        getSubjects();
                        setIsOpen(false);
                    }}
                    onClose={() => setIsOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}

            <Modal isOpen={isOpenEditModal} onClose= {() => setIsOpenEditModal(false)} title="Edit Subject" panelStyle = {panelStyleAdd}>
                <EditSubject
                    subject_id={selectedSubjectData?.id}
                    onSuccess={ () => {
                        getSubjects();
                        setIsOpenEditModal(false);
                    }
                        
                    }
                    onClose={() => setIsOpenEditModal(false)}
                />
            </Modal>
            
            
            {/* Delete Modal */}

            <Modal isOpen={isOpenDeleteModal} onClose={() => setIsOpenDeleteModal(false)} title="Delete Subject" panelStyle={panelStyleDelete}>
                <DeleteSubject 
                    subject_id={selectedSubjectData?.id}
                    onSuccess={() => {
                        getSubjects();
                        setIsOpenDeleteModal(false);
                    }}
                    onClose={() => setIsOpenDeleteModal(false)}
                />
            </Modal>
        </div>

    )
}

import Table from "../../components/Table"
import { useState, useEffect } from "react";
import axios from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import SearchForm from "../../components/SearchForm";
import AddSubject from "../Subjects/AddSubject";
import EditSubject from "../Subjects/EditSubject";
import ArchiveSubject from "../Subjects/ArchiveSubject";
import MoonLoader from "react-spinners/MoonLoader";
import ClassicButton from "../../components/classicButton";
import { LuPlus } from "react-icons/lu";

export default function SubjectManagement() {
    
    const subjectColumns = [
        //{id: 1, name: "ID", key: "id"},
        {id: 2, name: "Course Code", key: "name"},
        {id: 3, name: "Course Title", key: "description"}
    ];

    const [query, setQuery] = useState("");
    const [subjectData, setSubjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
    const [selectedSubjectData, setSelectedSubjectData] = useState(null);


    const getSubjects = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/subject/get`, {
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


    const panelStyleAdd = "w-full h-auto max-w-lg rounded-xl shadow-xl"
    const panelStyleDelete = "w-full h-auto max-w-lg rounded-xl shadow-xl"
    const pagination = [6, 8]

    return (
        <>
            <div className="grid lg:hidden justify-items-center w-full h-full px-5">
                <h1 className="font-extrabold text-xl md:text-3xl text-[#102E50] mt-[150px]">
                    NOT AVAILABLE ON MOBILE AND TABLET!
                </h1>
            </div>

            <div className="hidden lg:flex flex-col w-full h-auto min-h-screen py-5 px-10 text-white items-center">
                <div className="w-4/5 h-auto grid grid-cols-[2.5fr_1fr] gap-2  
                        lg:h-11 xl:h-12 2xl:h-15 mt-3">
                    <SearchForm query={query} setQuery={setQuery} inputPlaceholder="Search by subject name"/>
                    <ClassicButton 
                        buttonName="Add Subject"
                        icon={LuPlus}
                        onClick={() => setIsOpen(true)}
                                            
                        className="w-full 2xl:w-3/4 place-self-end" 
                        mainColor="#E78B48" 
                        darkColor="#B9652B"
                                        />
                </div>
                <div className="overflow-x-auto w-4/5 mt-[20px]">
                    {!loading ? (
                        <Table 
                            data={subjectData} 
                            columns={subjectColumns} 
                            setSelectedData={setSelectedSubjectData} 
                            setIsOpenEditModal={setIsOpenEditModal}
                            setIsOpenDeleteModal={setIsOpenArchiveModal}
                            pagination={pagination}
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

                <Modal isOpen={isOpenArchiveModal} onClose={() => setIsOpenArchiveModal(false)} title="Archive Subject" panelStyle={panelStyleDelete}>
                    <ArchiveSubject 
                        subject_id={selectedSubjectData?.id}
                        onSuccess={() => {
                            getSubjects();
                            setIsOpenArchiveModal(false);
                        }}
                        onClose={() => setIsOpenArchiveModal(false)}
                    />
                </Modal>
            </div>
        </>

    )
}
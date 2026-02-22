import SearchForm from "../../components/SearchForm"
import Table from "../../components/Table"
import { useState, useEffect } from "react"
import axios from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import AddClass from "../SchoolClasses/AddClass";
import EditClass from "../SchoolClasses/EditClass";
import ArchiveClass from "../SchoolClasses/ArchiveClass";
import UploadClasses from "../SchoolClasses/UploadClasses";
import { MoonLoader } from "react-spinners";
import ClassicButton from "../../components/classicButton";
import { LuPlus, LuUpload } from "react-icons/lu"; 

export default function ClassManagement() {

    const classesColumns = [
        //{ id: 1, name: "ID", key: "id" },
        { id: 2, name: "Course Code", key: "name" },
        { id: 3, name: "Course Description", key: "subjectName" },
        { id: 4, name: "Teacher Name", key: "teacherName" },
        { id: 5, name: "Section", key: "section" }, 
        { id: 6, name: "Room", key: "room" },  
        { id: 7, name: "Units", key: "units" },
        { id: 8, name: "Schedule", key: "schedule" },
        { id: 9, name: "Academic Yr", key: "academicYear" },  
        { id: 10, name: "Semester", key: "semester" },  
    ];

    const [query, setQuery] = useState("");
    const [classesData, setClassesData] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedClassData, setSelectedClassData] = useState(null);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
    const [isOpenUploadModal, setIsOpenUploadModal] = useState(false); // ADD THIS

    const getClasses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/classes/get`, {
                params : query.trim() !== "" ? {query} : {}
            })
            console.log(response.data);
            const formatted = response.data.map((cls) => ({
                ...cls,
                subjectName: cls.subject?.name || "—",
                teacherName: cls.userTeacher ? `${cls.userTeacher.firstName} ${cls.userTeacher.lastName}` : "—",
                section: cls.section || "—",  
                room: cls.room || "—",  
                academicYear: cls.academicYear || "—",  
                semester: cls.semester || "—",
                units: `${cls.lectureUnits || 0}${cls.labUnits > 0 ? `/${cls.labUnits}` : ''}`,
                lectureUnits: cls.lectureUnits || 0,
                labUnits: cls.labUnits || 0,
            }));
            setClassesData(formatted);
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

    
    const panelStyleAdd = "w-full h-auto rounded-xl shadow-xl"
    const panelStyleEdit = "w-full h-auto max-w-lg rounded-xl shadow-xl"
    const panelStyleDelete = "w-full h-auto max-w-lg rounded-xl shadow-xl rounded-xl"
    const panelStyleUpload = "w-full h-auto max-w-2xl rounded-xl shadow-xl" 

    const pagination = [7, 10]
    
    return (
        <>
            <div className="grid grid-rows-2 lg:hidden justify-items-center w-full h-full px-5">
                <h1 className="font-extrabold text-xl md:text-3xl text-[#102E50] mt-[150px]">
                    Sorry!
                </h1>
                <p className="font-extrabold text-xl md:text-3xl text-[#102E50] mt-[150px]">
                    NOT AVAILABLE ON MOBILE AND TABLET!
                </p>
            </div>

            <div className="hidden lg:flex flex-col w-full h-auto min-h-screen py-5 px-10 items-center text-white">
                <div className="w-full h-auto grid grid-cols-[3fr_1fr_1fr] gap-2 
                        lg:h-11 xl:h-12 2xl:h-15 mt-3">
                    <SearchForm query={query} setQuery={setQuery} inputPlaceholder="Search by Course Code, Course Name, Academic Year, Semester"/>
                    
                    {/* Upload Classes Button */}
                    <ClassicButton 
                        buttonName="Import Classes"
                        icon={LuUpload}
                        onClick={() => setIsOpenUploadModal(true)}
                        className="w-full" 
                        mainColor="#5C6BC0" 
                        darkColor="#3949AB"
                    />
                    
                    {/* Add Class Button */}
                    <ClassicButton 
                        buttonName="Add Class"
                        icon={LuPlus}
                        onClick={() => setIsOpenAddModal(true)}
                        className="w-full" 
                        mainColor="#E78B48" 
                        darkColor="#B9652B"
                    />
                </div>
                
                <div className="overflow-x-auto w-full mt-[20px]">
                    {error && <p className="text-red-800">{error}</p>}
                    {!loading ? (
                        <Table 
                            columns={classesColumns}
                            data={classesData}
                            setSelectedData={setSelectedClassData}
                            setIsOpenEditModal={setIsOpenEditModal}
                            setIsOpenDeleteModal={setIsOpenArchiveModal}
                            pagination={pagination}
                        />
                    ) : (                   
                        (<MoonLoader color="blue" loading={true} size={80} />)
                    )}
                </div>

                {/* Modal for uploading classes */}
                <Modal isOpen={isOpenUploadModal} onClose={() => setIsOpenUploadModal(false)} title="" panelStyle={panelStyleUpload}>
                    <UploadClasses 
                        onClose={() => setIsOpenUploadModal(false)}
                        onSuccess={() => {
                            getClasses();
                            setIsOpenUploadModal(false);
                        }}
                    />
                </Modal>

                {/* Modal for adding a class */}
                <Modal isOpen={isOpenAddModal} onClose={() => setIsOpenAddModal(false)} title="" panelStyle={panelStyleAdd}>
                    <AddClass 
                        onClose={() => setIsOpenAddModal(false)}
                        onSuccess={() => {
                            getClasses();
                            setIsOpenAddModal(false);
                        }}
                    />
                </Modal>

                {/* Edit Modal */}
                <Modal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} title="Edit Class" panelStyle={panelStyleEdit}>
                    <EditClass
                        classId={selectedClassData?.id}
                        onClose={() => setIsOpenEditModal(false)}
                        onSuccess={() => {
                            getClasses();
                            setIsOpenEditModal(false);
                        }}
                    />
                </Modal>
                
                {/* Archive Modal */}
                <Modal isOpen={isOpenArchiveModal} onClose={() => setIsOpenArchiveModal(false)} title="Archive Class" panelStyle={panelStyleDelete}>
                    <ArchiveClass
                        class_id={selectedClassData?.id}
                        onClose={() => setIsOpenArchiveModal(false)}
                        onSuccess={() => {
                            getClasses();
                            setIsOpenArchiveModal(false);
                        }}
                    />
                </Modal>
            </div>
        </>
    )
}
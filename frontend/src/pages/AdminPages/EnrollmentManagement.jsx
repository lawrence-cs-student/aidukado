import { useState, useEffect } from "react";
import axios from "axios";
import SearchForm from "../../components/SearchForm";
import { MoonLoader } from "react-spinners";
import AddEnrollment from "../Enrollment/AddEnrollment";
import EditEnrollment from "../Enrollment/EditEnrollment";
import DeleteEnrollment from "../Enrollment/DeleteEnrollment";
import Modal from "../../components/Modal";
import Table from "../../components/Table";

export default function EnrollmentManagement() {
  const enrollmentColumns = [
    { id: 1, name: "ID", key: "id" },
    { id: 2, name: "Class", key: "className" },
    { id: 3, name: "Full Name", key: "fullName" },
    { id: 4, name: "Status", key: "status" }
  ];

  const [query, setQuery] = useState("");
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.lastName} ${student.firstName}`
  }));

  const classOptions = classes.map((classData) => ({
    value: classData.id,
    label: classData.name
  }));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [selectedEnrollmentData, setSelectedEnrollmentData] = useState(null);

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [fetchDataError, setFetchDataError] = useState("");

  const [fetchingError, setFetchingError] = useState({
    studentError: "",
    classesError: ""
  });

  const getStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user/get_students");
      setStudents(response.data);
    } catch (err) {
      if (err.response?.data?.detail) {
        setFetchingError((prev) => ({
          ...prev,
          studentError: err.response.data.detail
        }));
      } else {
        setFetchingError((prev) => ({
          ...prev,
          studentError: "Network Error"
        }));
      }
    }
  };

  const getClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/classes/get");
      setClasses(response.data);
    } catch (err) {
      if (err.response?.data?.detail) {
        setFetchingError((prev) => ({
          ...prev,
          classesError: err.response.data.detail
        }));
      } else {
        setFetchingError((prev) => ({
          ...prev,
          classesError: "Network Error"
        }));
      }
    }
  };

  const getEnrollment = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/enrollment/get", {
        params: query.trim() !== "" ? { query } : {}
      });

      setEnrollmentData(response.data);
    } catch (err) {
      if (err.response?.data?.detail) {
        setFetchDataError(err.response.data.detail);
      } else {
        setFetchDataError("Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getEnrollment();
    }, 500);
    return () => {
      clearTimeout(delayDebounce);
    };
  }, [query]);

  useEffect(() => {
    getStudents();
    getClasses();
  }, []);

  const transformedData = enrollmentData.map((data) => {
    const className = classes.find((c) => c.id === data.classId)?.name || "";
    const student = students.find((s) => s.id === data.studentId);
    const fullName = student ? `${student.firstName} ${student.lastName}` : "";

    return {
      ...data,
      className,
      fullName
    };
  });

  const panelStyleAdd = "w-full h-2/5 max-w-lg rounded-xl shadow-xl";
  const panelStyleEdit = "w-full h-2/5 max-w-lg rounded-xl shadow-xl";
  const panelStyleDelete = "w-full h-1/3 max-w-lg rounded-xl shadow-xl";

  return (
    <div className="flex flex-col w-full h-screen gap-[2%] p-[2%] items-center">
      {fetchDataError && <p className="text-red-800">{fetchDataError}</p>}
      <div className="w-1/2 h-[5%] flex justify-end items-end gap-2">
        <SearchForm query={query} setQuery={setQuery} inputPlaceholder="Search by class, name, status"/>
        <button
          className=" bg-[#102E50] shadow-md"
          onClick={() => setIsOpenAddModal(true)}
        >
          + Enroll
        </button>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center">
        {success && <p className="text-green-800">{success}</p>}
        {fetchingError.studentError && (
          <p className="text-red-800">{fetchingError.studentError}</p>
        )}
        {fetchingError.classesError && (
          <p className="text-red-800">{fetchingError.classesError}</p>
        )}
        
        {!loading ? (
          <Table
            columns={enrollmentColumns}
            data={transformedData}
            setSelectedData={setSelectedEnrollmentData}
            setIsOpenEditModal={setIsOpenEditModal}
            setIsOpenDeleteModal={setIsOpenDeleteModal}
          />
        ) : (
          <MoonLoader color="blue" loading={true} size={80} />
        )}
      </div>

      <Modal
        isOpen={isOpenAddModal}
        onClose={() => setIsOpenAddModal(false)}
        title="Add Enrollment"
        panelStyle={panelStyleAdd}
      >
        <AddEnrollment
          studentOptions={studentOptions}
          classOptions={classOptions}
          setSuccess={setSuccess}
          onClose={() => setIsOpenAddModal(false)}
          onSuccess={() => {
            getEnrollment();
            setIsOpenAddModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
        title="Edit Enrollment"
        panelStyle={panelStyleEdit}
      >
        <EditEnrollment
          enrollmentId={selectedEnrollmentData?.id}
          classOptions={classOptions}
          studentOptions={studentOptions}
          setSuccess={setSuccess}
          onClose={() => setIsOpenEditModal(false)}
          onSuccess={() => {
            getEnrollment();
            setIsOpenEditModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        title="Delete Enrollment"
        panelStyle={panelStyleDelete}
      >
        <DeleteEnrollment
          enrollmentId={selectedEnrollmentData?.id}
          setSuccess={setSuccess}
          onClose={() => setIsOpenDeleteModal(false)}
          onSuccess={() => {
            getEnrollment();
            setIsOpenDeleteModal(false);
          }}
        />
      </Modal>
    </div>
  );
}

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from './components/sidebar';
import AIPretest from "./pages/AIPretest";
import Dashboard from "./pages/Dashboard";
import Lesson from './pages/Lesson';
import PostTest from './pages/PostTest';
import Login from "./components/Login";
import Signup from "./pages/Users/AddUser";
import StudentArea from './pages/StudentArea';

import RoleProtectedRoute from './components/RoleProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/AdminPages/UserManagement';
import ClassManagement from './pages/AdminPages/ClassManagement';
import SubjectManagement from './pages/AdminPages/SubjectManagement';
import EnrollmentManagement from './pages/AdminPages/EnrollmentManagement';
import AboutPage from './pages/About';
import Settings from './pages/Settings';
import StudentClasses from './pages/StudentClasses';
import TeacherClasses from './pages/TeacherClasses';
import SelectedClass from './pages/SelectedClass';
import SelectedLesson from './pages/Lesson/SelectedLesson';
import TermPage from './pages/TermPage';
import FileView from './pages/Lesson/FileView';

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex h-full w-full bg-white">
      {!hideSidebar && <Sidebar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <RoleProtectedRoute allowed_roles={["student", "admin", "teacher"]}>
                <Dashboard />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="subjects" 
            element={
              <RoleProtectedRoute allowed_roles={["student"]}>
                <StudentArea />
              </RoleProtectedRoute>
            }
          />
          <Route 
            path="/aipretest" 
            element={
              <RoleProtectedRoute allowed_roles={"teacher"}>
                <AIPretest />
              </RoleProtectedRoute>
            }
          />
          <Route path="/lesson" element={<Lesson/>}/>
          <Route path="/postTest" element={<PostTest/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path='/studentClasses' element={<StudentClasses />}/>

          {/* <Route 
            path='/teacherClasses' 
            element={
              <RoleProtectedRoute allowed_roles={"teacher"}>
                <TeacherClasses />
              </RoleProtectedRoute>
            }
          /> */}

          <Route 
            path="/teacherClasses" 
            element={<TeacherClasses />} 
          />



          <Route path='/selectedClass/:classId/:term' element={<SelectedClass />}/>
          <Route path='/selectedLesson/:lessonId' element={<SelectedLesson />} />
          <Route path='/termPage' element={<TermPage />} />
          <Route path='/fileView' element={<FileView />} />
          
          <Route path='/userManagement' element={<UserManagement/>}/>
          <Route path='/classManagement' element={<ClassManagement/>}/>
          <Route path='/subjectManagement' element={<SubjectManagement/>} />
          <Route path="/enrollmentManagement" element={<EnrollmentManagement />} />
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/help' element={<AboutPage/>}/>
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



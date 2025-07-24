import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AIPretest from "./pages/AIPretest";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex h-full w-full bg-white">
      {!hideSidebar && <Sidebar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aipretest" element={<AIPretest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
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



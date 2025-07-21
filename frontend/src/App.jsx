import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./screens/DashboardScreen";
import LearnAndTest from "./screens/LearnAndTestScreen";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-red-500">
        <Sidebar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn-and-test" element={<LearnAndTest />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

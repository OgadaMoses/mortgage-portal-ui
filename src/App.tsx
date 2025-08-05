import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import Dashboard from './pages/UserDashboard/UserDashboard';
import AdminPanel from "./pages/AdminPanel/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userdashboard" element={<Dashboard />} />
         <Route path="/admin" element={<AdminPanel />} /> 
      </Routes>
    </Router>
  );
}

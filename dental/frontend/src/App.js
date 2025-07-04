import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel.js';
import DoctorProfile from './pages/DoctorProfile';
import NotFound from './pages/NotFound';
import Navbar from './components/Layout/Navbar';
import AppointmentPage from './pages/AppointmentPage';
import PatientProfile from './pages/PatientProfile.js';

function App() {
    return (
        <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin-profile" element={<AdminPanel />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                    <Route path="/appointment" element={<AppointmentPage />} />
                    <Route path="/profile" element={<PatientProfile />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
        </AuthProvider>
    );
}

export default App;
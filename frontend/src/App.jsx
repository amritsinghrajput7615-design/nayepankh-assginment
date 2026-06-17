import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerList from './pages/VolunteerList';
import VolunteerDetail from './pages/VolunteerDetail';
import EmailSending from './pages/EmailSending';
import VolunteerDashboard from './pages/VolunteerDashboard';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <ToastProvider>
                <AuthProvider>
                    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
                        {/* Top Header */}
                        <Navbar />

                        {/* Page Content Routes */}
                        <div className="grow">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Volunteer Dashboard Route */}
                                <Route 
                                    path="/dashboard" 
                                    element={
                                        <ProtectedRoute allowedRoles={['volunteer']}>
                                            <VolunteerDashboard />
                                        </ProtectedRoute>
                                    } 
                                />

                                {/* Volunteer & Admin Protected Profile */}
                                <Route 
                                    path="/profile" 
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    } 
                                />

                                {/* Admin Portal Protected Routes */}
                                <Route 
                                    path="/admin" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/volunteers" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <VolunteerList />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/volunteers/:id" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <VolunteerDetail />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/mail" 
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <EmailSending />
                                        </ProtectedRoute>
                                    } 
                                />

                                {/* Catch-All 404 Route */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
};

export default App;

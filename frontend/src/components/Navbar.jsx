import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Menu, X, LogOut, User, Heart, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout, role } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        addToast('Logged out successfully', 'success');
        navigate('/');
        setIsOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinkClass = (path) => {
        return `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive(path)
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
        }`;
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                                NayePankh
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/" className={navLinkClass('/')}>
                            Home
                        </Link>

                        {isAuthenticated && role === 'admin' && (
                            <Link to="/admin" className={navLinkClass('/admin')}>
                                <div className="flex items-center gap-1.5">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </div>
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link to="/profile" className={navLinkClass('/profile')}>
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </div>
                            </Link>
                        )}

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-500">
                                    Hello, <span className="font-semibold text-slate-800">{user?.username || 'User'}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 transition-all rounded-xl cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors rounded-xl"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all rounded-xl shadow-md shadow-blue-500/20"
                                >
                                    Join as Volunteer
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:outline-hidden"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 pb-4 space-y-2 shadow-inner">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                            isActive('/') ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Home
                    </Link>

                    {isAuthenticated && role === 'admin' && (
                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                                isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}

                    {isAuthenticated && (
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                                isActive('/profile') ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Profile
                        </Link>
                    )}

                    <div className="h-px bg-slate-100 my-2"></div>

                    {isAuthenticated ? (
                        <div className="space-y-3 px-4">
                            <div className="text-sm font-medium text-slate-500">
                                Logged in as: <span className="font-bold text-slate-800">{user?.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 px-2">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex justify-center items-center py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-xl"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="flex justify-center items-center py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

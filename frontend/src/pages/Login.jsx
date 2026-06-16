import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, LogIn, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [role, setRole] = useState('volunteer'); // 'volunteer' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Retrieve redirect path from router state
    const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/profile');

    const validateForm = () => {
        const tempErrors = {};
        if (!email) {
            tempErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            tempErrors.password = 'Password is required';
        } else if (password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const res = await login(email, password, role);
        setLoading(false);

        if (res.success) {
            addToast(`Welcome back, ${res.user.username}!`, 'success');
            // Check where to redirect
            const redirectPath = role === 'admin' ? '/admin' : '/profile';
            navigate(redirectPath);
        } else {
            addToast(res.message, 'error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
                
                {/* Header Title */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-sm font-semibold text-slate-500">Sign in to your NayePankh account</p>
                </div>

                {/* Role Toggles */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setRole('volunteer')}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                            role === 'volunteer'
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        Volunteer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                            role === 'admin'
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Administrator
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.email 
                                        ? 'border-rose-400 focus:ring-rose-200 focus:bg-white' 
                                        : 'border-slate-200 focus:ring-blue-100 focus:bg-white'
                                }`}
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs font-bold text-rose-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.password 
                                        ? 'border-rose-400 focus:ring-rose-200 focus:bg-white' 
                                        : 'border-slate-200 focus:ring-blue-100 focus:bg-white'
                                }`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs font-bold text-rose-500 mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>Sign In as {role === 'admin' ? 'Admin' : 'Volunteer'}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Switch */}
                {role === 'volunteer' && (
                    <div className="text-center text-sm font-semibold text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

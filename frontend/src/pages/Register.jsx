import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Phone, MapPin, Sparkles, Heart, FileCode2 } from 'lucide-react';

const Register = () => {
    const { registerVolunteer } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        skills: '',
        interests: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const tempErrors = {};
        
        if (!formData.username.trim()) tempErrors.username = 'Username is required';
        
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.phone.trim()) {
            tempErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            tempErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address.trim()) tempErrors.address = 'Address is required';
        if (!formData.skills.trim()) tempErrors.skills = 'Please enter at least one skill';
        if (!formData.interests.trim()) tempErrors.interests = 'Please enter at least one interest';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addToast('Please correct the validation errors', 'error');
            return;
        }

        setLoading(true);

        // Process skills and interests as Arrays of Strings as backend expects
        const submissionData = {
            ...formData,
            role: 'volunteer', // Explicitly specify role
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean)
        };

        const res = await registerVolunteer(submissionData);
        setLoading(false);

        if (res.success) {
            addToast('Registration successful! Please sign in.', 'success');
            navigate('/login');
        } else {
            addToast(res.message, 'error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Become a Volunteer</h2>
                    <p className="text-sm font-semibold text-slate-500">Spread your wings and support our community campaigns</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Username */}
                    <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <User className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.username ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.username && <p className="text-xs font-bold text-rose-500">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="john@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-xs font-bold text-rose-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-xs font-bold text-rose-500">{errors.password}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Phone className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="10-digit number"
                            />
                        </div>
                        {errors.phone && <p className="text-xs font-bold text-rose-500">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start text-slate-400">
                                <MapPin className="w-4 h-4" />
                            </span>
                            <textarea
                                name="address"
                                rows="2"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.address ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="Your complete residence address..."
                            ></textarea>
                        </div>
                        {errors.address && <p className="text-xs font-bold text-rose-500">{errors.address}</p>}
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Skills (Comma Separated)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.skills ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="Teaching, Event management, Graphic Design, Fundraising"
                            />
                        </div>
                        {errors.skills && <p className="text-xs font-bold text-rose-500">{errors.skills}</p>}
                    </div>

                    {/* Interests */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Interests (Comma Separated)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Heart className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="interests"
                                value={formData.interests}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                                    errors.interests ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100'
                                }`}
                                placeholder="Education, Environment protection, Food distribution"
                            />
                        </div>
                        {errors.interests && <p className="text-xs font-bold text-rose-500">{errors.interests}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="sm:col-span-2 w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm rounded-2xl shadow-lg transition-all mt-2 cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span>Register & Join Family</span>
                        )}
                    </button>
                </form>

                {/* Footer Switch */}
                <div className="text-center text-sm font-semibold text-slate-500">
                    Already registered?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, MapPin, Sparkles, Heart, Save, Edit, Shield } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user, role, updateProfileState } = useAuth();
    const { addToast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        address: '',
        skills: '',
        interests: ''
    });
    const [errors, setErrors] = useState({});

    // Populate form on mount or when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                phone: user.phone || '',
                address: user.address || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
                interests: Array.isArray(user.interests) ? user.interests.join(', ') : ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const tempErrors = {};
        if (!formData.username.trim()) tempErrors.username = 'Username is required';
        
        if (role === 'volunteer') {
            if (!formData.phone.trim()) {
                tempErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone.trim())) {
                tempErrors.phone = 'Please enter a valid 10-digit phone number';
            }
            if (!formData.address.trim()) tempErrors.address = 'Address is required';
            if (!formData.skills.trim()) tempErrors.skills = 'Please enter at least one skill';
            if (!formData.interests.trim()) tempErrors.interests = 'Please enter at least one interest';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addToast('Please fix the validation errors', 'error');
            return;
        }

        setLoading(true);
        try {
            // Process skills/interests to arrays
            const processedData = {
                username: formData.username,
                phone: formData.phone,
                address: formData.address,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean)
            };

            const res = await api.put('/volunteers/profile', processedData);
            
            updateProfileState(res.data.user);
            addToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Error updating profile';
            addToast(errMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            {/* Header profile block */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent)]"></div>
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black shrink-0 uppercase border border-white/20 relative z-10">
                    {user.username ? user.username.charAt(0) : 'U'}
                </div>
                <div className="text-center sm:text-left space-y-2 relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user.username}</h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider">
                        {role === 'admin' ? (
                            <>
                                <Shield className="w-3.5 h-3.5" />
                                Admin Privileges
                            </>
                        ) : (
                            <>
                                <User className="w-3.5 h-3.5" />
                                Foundation Volunteer
                            </>
                        )}
                    </div>
                    <p className="text-sm text-blue-100 font-medium">Joined and registered account</p>
                </div>
            </div>

            {/* Profile Forms / Detail Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
                    {role === 'volunteer' && (
                        <button
                            type="button"
                            onClick={() => {
                                if (isEditing) {
                                    // Reset values
                                    setFormData({
                                        username: user.username || '',
                                        phone: user.phone || '',
                                        address: user.address || '',
                                        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
                                        interests: Array.isArray(user.interests) ? user.interests.join(', ') : ''
                                    });
                                }
                                setIsEditing(!isEditing);
                            }}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                                isEditing 
                                    ? 'bg-slate-50 text-slate-600 border-slate-200' 
                                    : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                            }`}
                        >
                            {isEditing ? 'Cancel' : (
                                <>
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit Profile
                                </>
                            )}
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username / Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    disabled={!isEditing}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                />
                            </div>
                            {errors.username && <p className="text-xs font-bold text-rose-500">{errors.username}</p>}
                        </div>

                        {/* Email (Read Only always) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email (Unique ID)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-500"
                                />
                            </div>
                        </div>

                        {role === 'volunteer' && (
                            <>
                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                            <Phone className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="phone"
                                            disabled={!isEditing}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-xs font-bold text-rose-500">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </span>
                                        <textarea
                                            name="address"
                                            rows="2"
                                            disabled={!isEditing}
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                        ></textarea>
                                    </div>
                                    {errors.address && <p className="text-xs font-bold text-rose-500">{errors.address}</p>}
                                </div>

                                {/* Skills */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills (Comma Separated)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                            <Sparkles className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="skills"
                                            disabled={!isEditing}
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                        />
                                    </div>
                                    {errors.skills && <p className="text-xs font-bold text-rose-500">{errors.skills}</p>}
                                </div>

                                {/* Interests */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interests (Comma Separated)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                            <Heart className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            name="interests"
                                            disabled={!isEditing}
                                            value={formData.interests}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                        />
                                    </div>
                                    {errors.interests && <p className="text-xs font-bold text-rose-500">{errors.interests}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Modifications</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;

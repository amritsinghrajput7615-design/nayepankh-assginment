import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Search, Filter, Mail, Eye, Trash2, SlidersHorizontal, Heart, ShieldAlert } from 'lucide-react';

const VolunteerList = () => {
    const { addToast } = useToast();
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteCandidateId, setDeleteCandidateId] = useState(null);

    // Fetch volunteers
    const fetchVolunteers = async () => {
        try {
            const res = await api.get('/admin/volunteers');
            setVolunteers(res.data.volunteers || []);
        } catch (error) {
            addToast(error.response?.data?.message || 'Error loading volunteers list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    // Extract all unique skills and interests for filtering
    const allSkills = Array.from(
        new Set(volunteers.flatMap(v => v.skills || []).map(s => s.trim()))
    ).sort();
    
    const allInterests = Array.from(
        new Set(volunteers.flatMap(v => v.interests || []).map(i => i.trim()))
    ).sort();

    // Trigger delete action
    const handleDeleteClick = (id) => {
        setDeleteCandidateId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteCandidateId) return;
        try {
            const res = await api.delete(`/admin/volunteers/${deleteCandidateId}`);
            addToast(res.data.message || 'Volunteer deleted successfully', 'success');
            // Refresh list
            setVolunteers(prev => prev.filter(v => v._id !== deleteCandidateId));
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to delete volunteer', 'error');
        } finally {
            setDeleteCandidateId(null);
        }
    };

    // Filter Logic
    const filteredVolunteers = volunteers.filter((vol) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            (vol.username || '').toLowerCase().includes(query) ||
            (vol.email || '').toLowerCase().includes(query) ||
            (vol.phone || '').includes(query);
            
        const matchesSkill = !selectedSkill || (vol.skills && vol.skills.some(s => s.trim() === selectedSkill));
        const matchesInterest = !selectedInterest || (vol.interests && vol.interests.some(i => i.trim() === selectedInterest));
        
        return matchesSearch && matchesSkill && matchesInterest;
    });

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
            <Sidebar />

            <main className="grow p-6 sm:p-8 space-y-6 max-w-7xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Volunteer Directory</h2>
                        <p className="text-sm font-semibold text-slate-500">Search, filter, and manage registered volunteers</p>
                    </div>
                    <div className="text-slate-500 font-semibold text-sm bg-white border border-slate-100 rounded-xl px-4 py-2 w-fit shadow-xs">
                        Showing <span className="text-blue-600 font-extrabold">{filteredVolunteers.length}</span> of {volunteers.length} volunteers
                    </div>
                </div>

                {/* Filters Board */}
                <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-3">
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Search and Filter Panel</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                placeholder="Search by name, email, phone..."
                            />
                        </div>

                        {/* Skills Filter */}
                        <div className="relative">
                            <select
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Filter by Skill (All)</option>
                                {allSkills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 pointer-events-none">
                                <Filter className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        {/* Interests Filter */}
                        <div className="relative">
                            <select
                                value={selectedInterest}
                                onChange={(e) => setSelectedInterest(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Filter by Interest (All)</option>
                                {allInterests.map(interest => (
                                    <option key={interest} value={interest}>{interest}</option>
                                ))}
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 pointer-events-none">
                                <Filter className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Volunteers Cards List */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredVolunteers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-slate-800">No Volunteers Found</h4>
                        <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVolunteers.map((vol) => (
                            <div 
                                key={vol._id} 
                                className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Volunteer Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                                                {vol.username}
                                            </h3>
                                            <p className="text-xs font-semibold text-slate-400 mt-1">{vol.email}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center uppercase shrink-0">
                                            {vol.username.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Skills Badges */}
                                    <div className="space-y-1.5">
                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {vol.skills && vol.skills.length > 0 ? (
                                                vol.skills.map((skill, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase"
                                                    >
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">None listed</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interests Badges */}
                                    <div className="space-y-1.5">
                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interests</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {vol.interests && vol.interests.length > 0 ? (
                                                vol.interests.map((interest, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase"
                                                    >
                                                        {interest.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">None listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-slate-100 my-4"></div>

                                {/* Card Actions */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">
                                        Phone: <span className="text-slate-600">{vol.phone}</span>
                                    </span>

                                    <div className="flex gap-1.5">
                                        <Link
                                            to={`/admin/volunteers/${vol._id}`}
                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl"
                                            title="View Detail"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to="/admin/mail"
                                            state={{ email: vol.email }}
                                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-xl"
                                            title="Send Email"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(vol._id)}
                                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl cursor-pointer"
                                            title="Delete Volunteer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Volunteer Account"
                message="Are you sure you want to delete this volunteer? This will permanently revoke their access and erase their profile from the directory database. This operation is irreversible."
                confirmText="Delete Permanently"
                cancelText="Cancel"
            />
        </div>
    );
};

export default VolunteerList;

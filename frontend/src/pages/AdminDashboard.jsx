import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Users, Heart, ClipboardCheck, UserPlus, Mail, Eye, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
    const { addToast } = useToast();
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const res = await api.get('/admin/volunteers');
                setVolunteers(res.data.volunteers || []);
            } catch (error) {
                console.error(error);
                addToast('Failed to load dashboard statistics', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, [addToast]);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    // Calculations
    const totalCount = volunteers.length;
    // Mocking active as those who have listed at least 2 skills or all
    const activeCount = volunteers.filter(v => v.skills && v.skills.length > 0).length;
    // Get last 5 registrations
    const recentRegistrations = [...volunteers].reverse().slice(0, 5);

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
            <Sidebar />

            <main className="grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h2>
                    <p className="text-sm font-semibold text-slate-500">Overview of NayePankh Foundation volunteer ecosystem</p>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Card 1: Total */}
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/80 flex items-center justify-between hover:shadow-lg transition-shadow">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Volunteers</p>
                            <h3 className="text-4xl font-black text-slate-800">{totalCount}</h3>
                        </div>
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Card 2: Active */}
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/80 flex items-center justify-between hover:shadow-lg transition-shadow">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Volunteers</p>
                            <h3 className="text-4xl font-black text-emerald-600">{activeCount}</h3>
                        </div>
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <ClipboardCheck className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Card 3: Recent */}
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/80 flex items-center justify-between hover:shadow-lg transition-shadow">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Registrations</p>
                            <h3 className="text-4xl font-black text-amber-500">{recentRegistrations.length}</h3>
                        </div>
                        <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
                            <UserPlus className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Recent Activities and Quick Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Registrations Table/List */}
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/80 lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <h4 className="text-lg font-bold text-slate-800">Recent Applications</h4>
                            <Link 
                                to="/admin/volunteers" 
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                View All Volunteers
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentRegistrations.length === 0 ? (
                            <div className="text-center py-10">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-slate-400">No volunteers registered yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Volunteer</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentRegistrations.map((vol) => (
                                            <tr key={vol._id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                    {vol.username}
                                                </td>
                                                <td className="py-3 text-sm font-semibold text-slate-500">{vol.email}</td>
                                                <td className="py-3 text-sm font-semibold text-slate-500 hidden sm:table-cell">{vol.phone}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            to={`/admin/volunteers/${vol._id}`}
                                                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            to="/admin/mail"
                                                            state={{ email: vol.email }}
                                                            className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-lg"
                                                            title="Email Volunteer"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quick Access panel */}
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/80 space-y-6">
                        <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Quick Links</h4>
                        
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/admin/volunteers"
                                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/30 rounded-2xl border border-slate-100 transition-all group"
                            >
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">Volunteer Directory</h5>
                                    <p className="text-xs text-slate-400 mt-0.5">Search and filter volunteers by skillsets</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/admin/mail"
                                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-100 transition-all group"
                            >
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">Bulk Mail Utility</h5>
                                    <p className="text-xs text-slate-400 mt-0.5">Draft and send welcome notifications</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>

                        {/* NGO Branding Card */}
                        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                            <div className="relative z-10 space-y-2">
                                <div className="flex items-center gap-2 text-rose-400">
                                    <Heart className="w-5 h-5 fill-rose-400" />
                                    <span className="font-bold text-xs tracking-wider uppercase">NayePankh NGO</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    "Spread wings of hope. Empowering marginalized sectors via youth action."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Sparkles, Heart, Trash2, MailQuestion, ArrowLeft, ClipboardList } from 'lucide-react';

const VolunteerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailing, setEmailing] = useState(false);
    
    // Delete modal states
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    // Status update states
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const handleUpdateStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            const res = await api.patch(`/volunteers/${id}/status`, { applicationStatus: newStatus });
            setVolunteer(prev => ({ ...prev, applicationStatus: newStatus }));
            addToast(res.data.message || `Status updated to ${newStatus} successfully!`, 'success');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to update application status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        const fetchVolunteerDetails = async () => {
            try {
                // GET /admin/volunteers/:id
                const res = await api.get(`/admin/volunteers/${id}`);
                setVolunteer(res.data.volunteer);
            } catch (error) {
                console.error(error);
                addToast(error.response?.data?.message || 'Error loading volunteer details', 'error');
                navigate('/admin/volunteers');
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteerDetails();
    }, [id, navigate, addToast]);

    // Handle delete
    const handleDelete = async () => {
        try {
            const res = await api.delete(`/admin/volunteers/${id}`);
            addToast(res.data.message || 'Volunteer deleted successfully', 'success');
            navigate('/admin/volunteers');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to delete volunteer', 'error');
        }
    };

    // Handle send email direct trigger
    const handleSendMail = async () => {
        setEmailing(true);
        try {
            // POST /admin/mail-volunteer
            const res = await api.post('/admin/mail-volunteer', { email: volunteer.email });
            addToast(res.data.message || 'Welcome email sent successfully!', 'success');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to send welcome email', 'error');
        } finally {
            setEmailing(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!volunteer) {
        return (
            <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
                <Sidebar />
                <div className="grow flex items-center justify-center p-8">
                    <div className="text-center space-y-3 bg-white p-10 rounded-3xl border border-slate-100 shadow-sm max-w-sm w-full">
                        <User className="w-16 h-16 text-slate-300 mx-auto" />
                        <h4 className="text-lg font-bold text-slate-800">Volunteer Not Found</h4>
                        <Link to="/admin/volunteers" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to directory
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
            <Sidebar />

            <main className="grow p-6 sm:p-8 space-y-6 max-w-4xl mx-auto overflow-hidden">
                {/* Back link */}
                <div>
                    <Link 
                        to="/admin/volunteers" 
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Volunteer List
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-md border border-slate-100/80 overflow-hidden">
                    {/* Card Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-emerald-500 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
                                <div className="w-full h-full rounded-full bg-blue-100 text-blue-700 text-3xl font-black flex items-center justify-center uppercase">
                                    {volunteer.username.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-16 p-6 sm:p-8 space-y-8">
                        {/* Name and Role */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">{volunteer.username}</h2>
                                <p className="text-sm font-semibold text-slate-400 mt-1">Volunteer Profile Details</p>
                            </div>

                            {/* Actions Group */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSendMail}
                                    disabled={emailing}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:bg-emerald-100 rounded-xl border border-emerald-100 transition-all cursor-pointer"
                                >
                                    {emailing ? (
                                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <MailQuestion className="w-3.5 h-3.5" />
                                            <span>Send Welcome Email</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate('/admin/assign-task', { state: { id: volunteer._id } })}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all cursor-pointer"
                                >
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    <span>Assign Task</span>
                                </button>
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>

                        {/* Status Control Panel */}
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 sm:p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Status</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        {volunteer.applicationStatus === 'selected' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black rounded-full uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Selected
                                            </span>
                                        ) : volunteer.applicationStatus === 'rejected' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black rounded-full uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                Not Selected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black rounded-full uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                Pending Review
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-400 font-semibold">
                                            (Click actions below to change status and notify candidate)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2.5">
                                <button
                                    onClick={() => handleUpdateStatus('selected')}
                                    disabled={updatingStatus || volunteer.applicationStatus === 'selected'}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all border border-transparent cursor-pointer"
                                >
                                    Select Volunteer
                                </button>
                                
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    disabled={updatingStatus || volunteer.applicationStatus === 'rejected'}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all border border-transparent cursor-pointer"
                                >
                                    Reject Volunteer
                                </button>

                                {volunteer.applicationStatus && volunteer.applicationStatus !== 'pending' && (
                                    <button
                                        onClick={() => handleUpdateStatus('pending')}
                                        disabled={updatingStatus}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        Mark as Pending
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Detailed Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="flex gap-4">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl h-fit shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                                    <p className="text-sm font-bold text-slate-800">{volunteer.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl h-fit shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</h4>
                                    <p className="text-sm font-bold text-slate-800">{volunteer.phone}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex gap-4 sm:col-span-2">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl h-fit shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resident Address</h4>
                                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{volunteer.address}</p>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="flex gap-4 sm:col-span-2">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl h-fit shrink-0">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acquired Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {volunteer.skills && volunteer.skills.length > 0 ? (
                                            volunteer.skills.map((skill, index) => (
                                                <span 
                                                    key={index} 
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase border border-blue-100/50"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">None listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="flex gap-4 sm:col-span-2">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl h-fit shrink-0">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Interests</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {volunteer.interests && volunteer.interests.length > 0 ? (
                                            volunteer.interests.map((interest, index) => (
                                                <span 
                                                    key={index} 
                                                    className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase border border-emerald-100/50"
                                                >
                                                    {interest.trim()}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">None listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirm Delete Account Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Remove Volunteer"
                message={`Are you sure you want to remove ${volunteer.username}? This will immediately delete their profile, and they will no longer be registered in the volunteer base.`}
                confirmText="Yes, Delete Account"
                cancelText="No, Keep Profile"
            />
        </div>
    );
};

export default VolunteerDetail;

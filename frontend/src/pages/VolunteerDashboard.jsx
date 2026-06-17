import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Sparkles, Heart, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const VolunteerDashboard = () => {
    const { user, updateProfileState } = useAuth();
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/volunteers/profile');
                setProfile(res.data.user);
                // Sync AuthContext state with fresh db data
                updateProfileState(res.data.user);
            } catch (error) {
                console.error(error);
                addToast('Failed to retrieve volunteer status details', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [addToast]);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    const currentVolunteer = profile || user;
    if (!currentVolunteer) return null;

    const status = currentVolunteer.applicationStatus || 'pending';

    // Status Cards configuration
    const statusConfigs = {
        pending: {
            title: 'Pending Review',
            message: 'Your application has been received and is currently under review by the NayePankh Foundation team.',
            cardBg: 'bg-amber-50 border-amber-200 text-amber-800',
            iconColor: 'text-amber-500 fill-amber-100',
            badgeBg: 'bg-amber-100 text-amber-800',
            icon: Clock,
        },
        selected: {
            title: 'Selected',
            message: 'Congratulations! You have been selected as a volunteer. Our team will contact you shortly with further details.',
            cardBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            iconColor: 'text-emerald-500 fill-emerald-100',
            badgeBg: 'bg-emerald-100 text-emerald-800',
            icon: CheckCircle,
        },
        rejected: {
            title: 'Not Selected',
            message: 'Thank you for your interest in volunteering. Unfortunately, your application was not selected at this time.',
            cardBg: 'bg-rose-50 border-rose-200 text-rose-800',
            iconColor: 'text-rose-500 fill-rose-100',
            badgeBg: 'bg-rose-100 text-rose-800',
            icon: XCircle,
        }
    };

    const config = statusConfigs[status] || statusConfigs.pending;
    const StatusIcon = config.icon;

    // Steps for the Progress Stepper
    const steps = [
        { name: 'Application Submitted', completed: true, active: false },
        { name: 'Under Review', completed: status !== 'pending', active: status === 'pending' },
        { name: 'Decision Made', completed: status === 'selected' || status === 'rejected', active: status === 'selected' || status === 'rejected', isRejected: status === 'rejected' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
            {/* Congratulations Banner for Selected State */}
            {status === 'selected' && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.15),transparent)]"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/20">
                            🎉
                        </div>
                        <div className="text-center sm:text-left space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Congratulations, {currentVolunteer.username}!</h2>
                            <p className="text-sm text-emerald-50 font-medium">
                                You are officially accepted as a NayePankh Foundation volunteer! Welcome to the family.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Dashboard Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8">
                {/* Volunteer Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-2xl uppercase border border-blue-100">
                            {currentVolunteer.username ? currentVolunteer.username.charAt(0) : 'V'}
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{currentVolunteer.username}</h2>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs font-semibold">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{currentVolunteer.email}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${config.badgeBg} border`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {config.title}
                        </span>
                    </div>
                </div>

                {/* Progress Stepper Indicator */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Lifecycle Progress</h3>
                    <div className="relative">
                        {/* Desktop Horizontal Progress Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block z-0"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {steps.map((step, idx) => {
                                let iconStyle = 'bg-white border-2 border-slate-200 text-slate-400';
                                if (step.completed) {
                                    if (step.isRejected) {
                                        iconStyle = 'bg-rose-500 border-2 border-rose-600 text-white shadow-md shadow-rose-500/20';
                                    } else {
                                        iconStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-md shadow-emerald-500/20';
                                    }
                                } else if (step.active) {
                                    iconStyle = 'bg-amber-500 border-2 border-amber-600 text-white shadow-md shadow-amber-500/20';
                                }

                                return (
                                    <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl border border-slate-100 md:border-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 transition-all duration-300 ${iconStyle}`}>
                                            {step.completed ? (
                                                step.isRejected ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>
                                        <div className="space-y-1 text-left md:text-center">
                                            <p className={`text-sm font-bold ${step.active || step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {step.name}
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-400">
                                                {idx === 0 && 'Done'}
                                                {idx === 1 && (status === 'pending' ? 'Currently Evaluating' : 'Evaluation Finished')}
                                                {idx === 2 && (status === 'selected' ? 'Approved' : status === 'rejected' ? 'Declined' : 'Decision Pending')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Status Message Card (Green/Yellow/Red) */}
                <div className={`rounded-3xl border p-6 flex flex-col sm:flex-row items-start gap-4 transition-all duration-300 shadow-xs ${config.cardBg}`}>
                    <div className={`p-3 rounded-2xl bg-white/60 shrink-0 border border-white/50 ${config.iconColor}`}>
                        <StatusIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-extrabold text-base tracking-tight">Status: {config.title}</h4>
                        <p className="text-sm font-semibold leading-relaxed opacity-90">{config.message}</p>
                    </div>
                </div>

                {/* Additional Profile Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {/* Skills Column */}
                    <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Skills Listed</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {currentVolunteer.skills && currentVolunteer.skills.length > 0 ? (
                                currentVolunteer.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2.5 py-1 bg-white border border-slate-200/80 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 italic">None listed</span>
                            )}
                        </div>
                    </div>

                    {/* Interests Column */}
                    <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span className="text-sm">Causes/Interests</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {currentVolunteer.interests && currentVolunteer.interests.length > 0 ? (
                                currentVolunteer.interests.map((interest, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2.5 py-1 bg-white border border-slate-200/80 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider"
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

                {/* NGO Trust Footer */}
                <div className="flex items-center justify-between p-4 bg-blue-50/20 rounded-2xl border border-blue-100/30 text-xs font-semibold text-slate-500">
                    <span>NayePankh Foundation registration program</span>
                    <span className="text-blue-600 font-bold">Spread wings of hope 🕊️</span>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;

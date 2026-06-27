import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Calendar, User, FileText, AlertCircle, Send } from 'lucide-react';

const AssignTask = () => {
    const location = useLocation();
    const { addToast } = useToast();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    // Load volunteers and check state
    useEffect(() => {
        const loadVolunteers = async () => {
            try {
                const res = await api.get('/admin/volunteers');
                const list = res.data.volunteers || [];
                setVolunteers(list);

                // If state has an id (pre-selected), pre-select it
                if (location.state?.volunteerId) {
                    setSelectedVolunteerId(location.state.volunteerId);
                } else if (location.state?.id) {
                    setSelectedVolunteerId(location.state.id);
                } else if (list.length > 0) {
                    setSelectedVolunteerId(list[0]._id);
                }
            } catch (error) {
                addToast('Failed to load volunteer lists', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadVolunteers();
    }, [location.state, addToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedVolunteerId) {
            addToast('Please select a recipient volunteer', 'error');
            return;
        }
        if (!title.trim()) {
            addToast('Please enter a task title', 'error');
            return;
        }
        if (!description.trim()) {
            addToast('Please enter a task description', 'error');
            return;
        }
        if (!deadline) {
            addToast('Please select a deadline', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post(`/admin/volunteers/${selectedVolunteerId}/assign-task`, {
                title: title.trim(),
                description: description.trim(),
                deadline
            });
            addToast(res.data.message || 'Task assigned successfully!', 'success');
            // Reset form fields
            setTitle('');
            setDescription('');
            setDeadline('');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to assign task', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
            <Sidebar />

            <main className="grow p-6 sm:p-8 space-y-6 max-w-3xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assign Task</h2>
                    <p className="text-sm font-semibold text-slate-500">Create and delegate a new task to a specific volunteer</p>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100/80">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Volunteer Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Recipient Volunteer
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <User className="w-4 h-4" />
                                    </span>
                                    <select
                                        value={selectedVolunteerId}
                                        onChange={(e) => setSelectedVolunteerId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        {volunteers.length === 0 ? (
                                            <option value="">No volunteers available</option>
                                        ) : (
                                            volunteers.map((vol) => (
                                                <option key={vol._id} value={vol._id}>
                                                    {vol.username} ({vol.email})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Task Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Task Title
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <FileText className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Enter task title"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Deadline
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Task Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Task Description
                                </label>
                                <div className="relative">
                                    <textarea
                                        rows="6"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Enter task details and requirements..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Alert tip */}
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 leading-normal">
                                    Assigning a task will record it under the volunteer's active assignments, which they can view and update from their dashboard.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting || volunteers.length === 0}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Assign Task</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AssignTask;

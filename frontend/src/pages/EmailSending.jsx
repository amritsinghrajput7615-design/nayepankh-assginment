import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Mail, Send, Sparkles, User, AlertCircle, ArrowLeft } from 'lucide-react';

const EmailSending = () => {
    const location = useLocation();
    const { addToast } = useToast();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs
    const [selectedEmail, setSelectedEmail] = useState('');
    const [subject, setSubject] = useState('Welcome to NayePankh Foundation');
    const [message, setMessage] = useState(
        "Thank you for registering as a volunteer.\nWe are excited to have you with us!\nOur coordinator will reach out to you shortly for upcoming drives."
    );

    // Load volunteers and check state
    useEffect(() => {
        const loadVolunteers = async () => {
            try {
                const res = await api.get('/admin/volunteers');
                const list = res.data.volunteers || [];
                setVolunteers(list);

                // If state has an email, preselect it
                if (location.state?.email) {
                    setSelectedEmail(location.state.email);
                } else if (list.length > 0) {
                    setSelectedEmail(list[0].email);
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
        if (!selectedEmail) {
            addToast('Please select a recipient volunteer', 'error');
            return;
        }
        if (!subject.trim()) {
            addToast('Please enter a subject', 'error');
            return;
        }
        if (!message.trim()) {
            addToast('Please enter a message body', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/admin/mail-volunteer', {
                email: selectedEmail,
                subject,
                message
            });
            addToast(res.data.message || 'Email sent successfully!', 'success');
            // Reset message
            setMessage('');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to dispatch email', 'error');
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
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Email Console</h2>
                    <p className="text-sm font-semibold text-slate-500">Send custom messages or welcoming alerts to volunteers</p>
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
                                        value={selectedEmail}
                                        onChange={(e) => setSelectedEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        {volunteers.length === 0 ? (
                                            <option value="">No volunteers available</option>
                                        ) : (
                                            volunteers.map((vol) => (
                                                <option key={vol._id} value={vol.email}>
                                                    {vol.username} ({vol.email})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Subject line
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <Sparkles className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Enter email subject"
                                    />
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Message Body
                                </label>
                                <div className="relative">
                                    <textarea
                                        rows="6"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
                                        placeholder="Draft your mail body text here..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Alert tip */}
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 leading-normal">
                                    Emails are processed through NayePankh's registered SMTP account and will contain the volunteer's customized greeting. 
                                </p>
                            </div>

                            {/* Send Button */}
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
                                            <span>Send Email</span>
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

export default EmailSending;

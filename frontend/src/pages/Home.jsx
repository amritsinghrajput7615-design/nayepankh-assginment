import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Globe, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, role } = useAuth();

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
            {/* Hero Section */}
            <header className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 text-white shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)]"></div>
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10">
                        <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                        Spread Happiness, Empower Lives
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
                        NayePankh Foundation <br/>
                        <span className="text-emerald-300">Volunteer Network</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        Join our mission to bring change and spread wings of hope. Connect, volunteer, and make a real difference in the lives of underprivileged communities.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        {isAuthenticated ? (
                            <Link
                                to={role === 'admin' ? '/admin' : '/profile'}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                            >
                                Go to {role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 text-base font-bold rounded-2xl shadow-xl transition-all duration-200"
                                >
                                    Register as Volunteer
                                    <ChevronRight className="w-5 h-5 text-blue-600" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-800/50 hover:bg-blue-800/80 border border-white/20 text-white text-base font-bold rounded-2xl transition-all duration-200"
                                >
                                    Log In Portal
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Impact Highlights / Stats */}
            <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 hover:translate-y-[-4px] transition-all duration-300">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800">500+</h3>
                            <p className="text-sm font-semibold text-slate-500">Active Volunteers</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 hover:translate-y-[-4px] transition-all duration-300">
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
                            <Heart className="w-7 h-7 fill-rose-50" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800">10,000+</h3>
                            <p className="text-sm font-semibold text-slate-500">Lives Touched</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 hover:translate-y-[-4px] transition-all duration-300">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Globe className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800">50+</h3>
                            <p className="text-sm font-semibold text-slate-500">Drives Conducted</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Volunteer Section */}
            <section className="py-20 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        Why Volunteer with <br/>
                        <span className="text-blue-600">NayePankh Foundation?</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        NayePankh is one of the leading NGOs working for underprivileged sectors. We focus on food distribution, primary education, sanitation, and women empowerment. By joining our volunteer family, you gain:
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Official volunteering completion certificate',
                            'Real-world project execution & leadership experience',
                            'Collaboration with a passionate, nationwide youth network',
                            'Direct and tangible social impact recognition'
                        ].map((point, index) => (
                            <li key={index} className="flex items-start gap-3 text-slate-700 font-semibold">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gradient-to-tr from-blue-50 to-emerald-50 p-8 rounded-3xl border border-blue-100/30 flex flex-col gap-6 justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0 h-fit">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Make a Tangible Difference</h4>
                            <p className="text-sm text-slate-500 mt-1">Our drives directly supply meals, books, and hygiene products to children in slum sectors.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 h-fit">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Nurture Empathy & Skills</h4>
                            <p className="text-sm text-slate-500 mt-1">Hone your communication, management, and organizational skills while spreading kindness.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} NayePankh Foundation. All Rights Reserved.</p>
                    <div className="flex gap-4">
                        <a href="https://nayepankh.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Official Website</a>
                        <Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

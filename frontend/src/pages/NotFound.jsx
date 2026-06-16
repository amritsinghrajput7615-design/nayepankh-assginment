import React from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4">
            <div className="text-center space-y-6 max-w-md bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100/80">
                
                {/* 404 Icon */}
                <div className="inline-flex p-5 bg-rose-50 text-rose-500 rounded-full animate-bounce">
                    <HeartOff className="w-12 h-12" />
                </div>

                {/* Typography */}
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-950 tracking-tight">404</h1>
                    <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
                    <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                        Oops! The resource or page you are searching for does not exist or has been relocated.
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 max-w-xs mx-auto"></div>

                {/* Back Button */}
                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Home Page</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

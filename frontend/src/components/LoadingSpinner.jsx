import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div className={`relative flex items-center justify-center`}>
            <div className={`animate-spin rounded-full border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent ${sizeClasses[size] || sizeClasses.md}`}></div>
            <div className="absolute animate-pulse text-[10px] text-blue-600 font-semibold tracking-wider">NP</div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-xs">
                <div className="flex flex-col items-center gap-3 p-6 bg-white shadow-xl rounded-2xl border border-slate-100">
                    {spinner}
                    <p className="text-sm font-semibold text-slate-700 animate-pulse">Loading Portal...</p>
                </div>
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;

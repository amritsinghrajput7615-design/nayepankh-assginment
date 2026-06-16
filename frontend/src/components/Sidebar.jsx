import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, User, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
    const linkClass = ({ isActive }) => {
        return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
            isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
        }`;
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-100 min-h-[calc(100vh-4rem)] p-4 hidden md:flex flex-col gap-6 shrink-0">
            {/* Header info */}
            <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Control Panel</h4>
                    <p className="text-sm font-bold text-slate-800">Administrator</p>
                </div>
            </div>

            {/* Nav List */}
            <nav className="flex flex-col gap-1 grow">
                <NavLink to="/admin" end className={linkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Stats</span>
                </NavLink>

                <NavLink to="/admin/volunteers" className={linkClass}>
                    <Users className="w-4 h-4" />
                    <span>Volunteers List</span>
                </NavLink>

                <NavLink to="/admin/mail" className={linkClass}>
                    <Mail className="w-4 h-4" />
                    <span>Send Emails</span>
                </NavLink>

                <div className="h-px bg-slate-100 my-4"></div>

                <NavLink to="/profile" className={linkClass}>
                    <User className="w-4 h-4" />
                    <span>Admin Profile</span>
                </NavLink>
            </nav>

            {/* Footer help */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                <h5 className="text-xs font-bold text-slate-700">NayePankh Foundation</h5>
                <p className="text-xxs text-slate-400 mt-1 leading-normal">
                    You are viewing the dashboard with elevated security privileges. Make modifications carefully.
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    Brain,
    Activity,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    Heart,
    TrendingUp,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            current: location.pathname === '/dashboard',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            hoverColor: 'hover:bg-teal-50 hover:text-teal-700'
        },
        {
            name: 'Upload Report',
            href: '/upload',
            icon: Upload,
            current: location.pathname === '/upload',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-50 hover:text-blue-700'
        },
        {
            name: 'Vitals Tracker',
            href: '/vitals',
            icon: Activity,
            current: location.pathname === '/vitals',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-50 hover:text-green-700'
        },
        {
            name: 'AI Insights',
            href: '/insights',
            icon: Brain,
            current: location.pathname === '/insights',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-50 hover:text-purple-700'
        },
        {
            name: 'Medical Reports',
            href: '/reports',
            icon: FileText,
            current: location.pathname === '/reports',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            hoverColor: 'hover:bg-indigo-50 hover:text-indigo-700'
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: User,
            current: location.pathname === '/profile',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            hoverColor: 'hover:bg-gray-50 hover:text-gray-700'
        }
    ];

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-20 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                >
                    {isOpen ? (
                        <X className="h-5 w-5 text-gray-600" />
                    ) : (
                        <Menu className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Heart className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-white">
                                <div className="text-xl font-bold tracking-tight">HealthMate AI</div>
                                <div className="text-sm opacity-90 font-medium">Sehat ka Smart Dost</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 py-8 space-y-3">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.current;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-200
                                        ${isActive
                                            ? `${item.bgColor} ${item.color} shadow-sm border border-opacity-20`
                                            : `text-gray-600 ${item.hoverColor} border border-transparent`
                                        }
                                    `}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className={`
                                        flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200
                                        ${isActive ? item.bgColor : 'bg-gray-50 group-hover:bg-gray-100'}
                                    `}>
                                        <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500'}`} />
                                    </div>
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-teal-500 rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button */}
                    <div className="p-6 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-4 text-sm font-medium text-red-600 rounded-2xl hover:bg-red-50 transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-red-50 group-hover:bg-red-100 transition-colors">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
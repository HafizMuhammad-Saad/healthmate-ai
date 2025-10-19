import React, { useState, useEffect } from "react";
import { Heart, Bell, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isProfileMenuOpen) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, [isProfileMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to={isAuthenticated ? "/dashboard" : "/"}
                        className="flex items-center gap-4 group"
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors tracking-tight">
                                HealthMate AI
                            </div>
                            <div className="text-sm text-gray-500 font-medium -mt-1">
                                Sehat ka Smart Dost
                            </div>
                        </div>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                {/* Quick Actions */}
                                <div className="hidden lg:flex items-center gap-3">
                                    <Link
                                        to="/upload"
                                        className={`p-3 rounded-xl transition-all duration-200 ${
                                            isActive('/upload')
                                                ? 'bg-teal-50 text-teal-600 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                                        }`}
                                        title="Upload Report"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/vitals"
                                        className={`p-3 rounded-xl transition-all duration-200 ${
                                            isActive('/vitals')
                                                ? 'bg-teal-50 text-teal-600 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                                        }`}
                                        title="Vitals Tracker"
                                    >
                                        <Bell className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Notifications */}
                                <button className="relative p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-all duration-200">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                                        3
                                    </span>
                                </button>

                                {/* Profile Menu */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsProfileMenuOpen(!isProfileMenuOpen);
                                        }}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-2xl object-cover border-2 border-white"
                                                />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {user?.name || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Health Dashboard
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                                            <div className="px-6 py-4 border-b border-gray-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                                                        {user?.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                className="w-12 h-12 rounded-2xl object-cover border-2 border-white"
                                                            />
                                                        ) : (
                                                            <UserIcon className="w-6 h-6 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {user?.name || 'User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {user?.email || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-3">
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center gap-4 px-6 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                                        <Heart className="w-4 h-4 text-teal-600" />
                                                    </div>
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/reports"
                                                    className="flex items-center gap-4 px-6 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <UserIcon className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    Profile & Reports
                                                </Link>
                                                <Link
                                                    to="/insights"
                                                    className="flex items-center gap-4 px-6 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                                        <Settings className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-50 pt-3">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-4 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                                >
                                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                                        <Settings className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Public Navigation
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="px-5 py-3 text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors rounded-xl hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

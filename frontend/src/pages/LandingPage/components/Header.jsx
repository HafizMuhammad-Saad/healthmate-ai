import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
    Heart,
    Menu,
    X,
    Home,
    Info,
    LogIn,
    UserPlus,
    LayoutDashboard,
    Upload,
    Activity,
    User,
    LogOut,
    Settings
} from 'lucide-react';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-4 group"
                        onClick={() => setIsMobileMenuOpen(false)}
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

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        {!isAuthenticated ? (
                            // Public Navigation
                            <>
                                <Link
                                    to="/"
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive('/')
                                            ? 'bg-teal-50 text-teal-700 shadow-sm'
                                            : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Home
                                </Link>
                                {/* <Link
                                    to="/about"
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive('/about')
                                            ? 'bg-teal-50 text-teal-700 shadow-sm'
                                            : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                    }`}
                                >
                                    About
                                </Link> */}
                                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
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
                            </>
                        ) : (
                            // Authenticated Navigation
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                        isActive('/dashboard')
                                            ? 'bg-teal-50 text-teal-600 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                                    }`}
                                    title="Dashboard"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/upload"
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                        isActive('/upload')
                                            ? 'bg-teal-50 text-teal-600 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                                    }`}
                                    title="Upload Report"
                                >
                                    <Upload className="w-5 h-5" />
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
                                    <Activity className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/reports"
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                        isActive('/reports')
                                            ? 'bg-teal-50 text-teal-600 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                                    }`}
                                    title="Profile"
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ml-4"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
                        <nav className="py-6 space-y-3">
                            {!isAuthenticated ? (
                                // Public Mobile Navigation
                                <>
                                    <Link
                                        to="/"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Home className="w-5 h-5" />
                                        Home
                                    </Link>
                                    <Link
                                        to="/about"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/about')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Info className="w-5 h-5" />
                                        About
                                    </Link>
                                    <div className="pt-4 border-t border-gray-100 space-y-3">
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50 transition-colors w-full"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <LogIn className="w-5 h-5" />
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-colors w-full"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Get Started
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                // Authenticated Mobile Navigation
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/dashboard')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/upload"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/upload')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Upload className="w-5 h-5" />
                                        Upload Report
                                    </Link>
                                    <Link
                                        to="/vitals"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/vitals')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Activity className="w-5 h-5" />
                                        Vitals
                                    </Link>
                                    <Link
                                        to="/reports"
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive('/reports')
                                                ? 'bg-teal-50 text-teal-700'
                                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5" />
                                        Profile
                                    </Link>
                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

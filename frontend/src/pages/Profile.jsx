import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Mail, User, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                dob: user.dob || '',
            });
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.put(`${baseURL}/user/profile`, formData, config);
            setUser(res.data.user);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-6 shadow-lg flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Hello, {user.name}!</h2>
                    <p className="text-teal-100 opacity-90">Manage your personal information and preferences here.</p>
                </div>
                <Edit2 className="h-10 w-10 text-white" />
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <form className="space-y-4" onSubmit={handleUpdate}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
                            <div className="flex items-center border rounded-lg p-2">
                                <User className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full outline-none text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm mb-1">Email</label>
                            <div className="flex items-center border rounded-lg p-2">
                                <Mail className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full outline-none text-gray-700"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Date of Birth</label>
                        <div className="flex items-center border rounded-lg p-2">
                            <Calendar className="text-gray-400 mr-2" />
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full outline-none text-gray-700"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-teal-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                    >
                        {updating ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>

            {/* Optional Stats or Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Stats Overview</h3>
                    <p className="text-gray-600 text-sm">Your latest vitals, reports, and AI insights will appear here.</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                    <p className="text-gray-600 text-sm">Set your notification preferences and other personalized options here.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

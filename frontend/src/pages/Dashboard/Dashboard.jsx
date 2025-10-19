import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    Heart, 
    FileText, 
    TrendingUp, 
    Upload, 
    Brain,
    Activity,
    Scale,
    Droplets
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentReports, setRecentReports] = useState([]);
    const [vitalStats, setVitalStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Fetch recent reports
            const reportsRes = await axios.get(`${baseURL}/upload/reports?limit=3`, config);
            setRecentReports(reportsRes.data.data || []);

            // Fetch vital statistics
            const vitalsRes = await axios.get(`${baseURL}/vitals/stats?days=7`, config);
            setVitalStats(vitalsRes.data.data);

        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor = "bg-white" }) => (
        <div className={`${bgColor} rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm`} style={{ backgroundColor: `${color}15` }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{title}</p>
                            <p className="text-3xl font-bold text-gray-900">{value || 'No data'}</p>
                        </div>
                    </div>
                    {subtitle && <p className="text-gray-500 text-sm ml-15">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-teal-100 opacity-90">
                    Track your health, analyze reports, and get AI-powered insights to stay healthy.
                </p>
            </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={FileText}
                        title="Total Reports"
                        value={recentReports.length}
                        subtitle="Medical reports"
                        color="#3B82F6"
                    />
                    <StatCard
                        icon={Activity}
                        title="Blood Pressure"
                        value={vitalStats?.bloodPressure?.avgSystolic ? 
                            `${vitalStats.bloodPressure.avgSystolic}/${vitalStats.bloodPressure.avgDiastolic}` : 
                            'No data'
                        }
                        subtitle="Last 7 days avg"
                        color="#EF4444"
                    />
                    <StatCard
                        icon={Droplets}
                        title="Blood Sugar"
                        value={vitalStats?.bloodSugar?.avgLevel || 'No data'}
                        subtitle="mg/dL average"
                        color="#F59E0B"
                    />
                    <StatCard
                        icon={Scale}
                        title="Weight"
                        value={vitalStats?.weight?.avgWeight ? `${vitalStats.weight.avgWeight} kg` : 'No data'}
                        subtitle="Current weight"
                        color="#10B981"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Reports */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                            <Link 
                                to="/reports" 
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View All
                            </Link>
                        </div>
                        
                        {recentReports.length > 0 ? (
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <div key={report._id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {report.fileName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                report.analysisStatus === 'completed' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : report.analysisStatus === 'analyzing'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {report.analysisStatus}
                                            </span>
                                        </div>
                                        {report.analysisStatus === 'completed' && report.aiSummaryEn && (
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                {report.aiSummaryEn.substring(0, 100)}...
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No reports uploaded yet</p>
                                <Link 
                                    to="/upload" 
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Upload your first report
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        
                        <div className="space-y-4">
                            <Link 
                                to="/upload" 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                <Upload className="h-8 w-8 text-blue-600 mr-4" />
                                <div>
                                    <p className="font-medium text-gray-900">Upload Medical Report</p>
                                    <p className="text-sm text-gray-600">Get AI analysis in English & Urdu</p>
                                </div>
                            </Link>

                            <Link 
                                to="/vitals" 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                            >
                                <Heart className="h-8 w-8 text-green-600 mr-4" />
                                <div>
                                    <p className="font-medium text-gray-900">Track Vitals</p>
                                    <p className="text-sm text-gray-600">Record BP, sugar, weight & more</p>
                                </div>
                            </Link>

                            <Link 
                                to="/insights" 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                            >
                                <Brain className="h-8 w-8 text-purple-600 mr-4" />
                                <div>
                                    <p className="font-medium text-gray-900">AI Health Insights</p>
                                    <p className="text-sm text-gray-600">Get personalized recommendations</p>
                                </div>
                            </Link>

                            <Link 
                                to="/trends" 
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                            >
                                <TrendingUp className="h-8 w-8 text-indigo-600 mr-4" />
                                <div>
                                    <p className="font-medium text-gray-900">View Trends</p>
                                    <p className="text-sm text-gray-600">Visualize your health data</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Medical Disclaimer:</strong> AI insights provided by HealthMate AI are for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                    </p>
                </div>
            </div>
        // </div>
    );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { 
    FileText, 
    Eye, 
    Trash2, 
    Download, 
    Filter, 
    Search,
    Calendar,
    Check,
    Clock,
    AlertTriangle,
    Image,
    FileIcon
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReportsHistory = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showUrdu, setShowUrdu] = useState(false);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        filterReports();
    }, [reports, searchTerm, statusFilter]);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseURL}/upload/reports?limit=50`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data.data || []);
        } catch (error) {
            console.error('Fetch reports error:', error);
            toast.error('Error loading reports');
        } finally {
            setLoading(false);
        }
    };

    const filterReports = () => {
        let filtered = reports;

        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.aiSummaryEn?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(report => report.analysisStatus === statusFilter);
        }

        setFilteredReports(filtered);
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${baseURL}/upload/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Report deleted successfully');
            fetchReports();
        } catch (error) {
            console.error('Delete report error:', error);
            toast.error(error.response?.data?.message || 'Error deleting report');
        }
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowDetails(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <Check className="h-4 w-4 text-green-600" />;
            case 'analyzing':
                return <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />;
            case 'failed':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'analyzing':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'failed':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
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
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
                            <p className="text-gray-600">View and manage your uploaded reports</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {filteredReports.length} of {reports.length} reports
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="analyzing">Analyzing</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredReports.length > 0 ? (
                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {report.fileType === 'image' ? (
                                                <Image className="h-10 w-10 text-blue-600" />
                                            ) : (
                                                <FileIcon className="h-10 w-10 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                {report.fileName}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(report.analysisStatus)}
                                                    <span className={getStatusBadge(report.analysisStatus)}>
                                                        {report.analysisStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            {report.analysisStatus === 'completed' && report.aiSummaryEn && (
                                                <p className="mt-2 text-sm text-gray-700">
                                                    {report.aiSummaryEn.substring(0, 150)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleViewReport(report)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <a
                                            href={report.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="h-5 w-5" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(report._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {searchTerm || statusFilter !== 'all' 
                                ? 'No reports match your filters'
                                : 'No reports uploaded yet'
                            }
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Upload your first medical report to get started with AI analysis.'
                            }
                        </p>
                        {(!searchTerm && statusFilter === 'all') && (
                            <a
                                href="/upload"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Upload Report
                            </a>
                        )}
                    </div>
                )}
            </div>

            {showDetails && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {selectedReport.fileName}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Uploaded on {new Date(selectedReport.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {selectedReport.analysisStatus === 'completed' && (
                                selectedReport.aiSummaryEn || selectedReport.aiSummaryUr
                            ) ? (
                                <div>
                                    <div className="flex space-x-2 mb-6">
                                        <button
                                            onClick={() => setShowUrdu(false)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                !showUrdu 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => setShowUrdu(true)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                showUrdu 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Roman Urdu
                                        </button>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            {showUrdu ? 'AI Analysis (Roman Urdu):' : 'AI Analysis (English):'}
                                        </h3>
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {showUrdu ? selectedReport.aiSummaryUr : selectedReport.aiSummaryEn}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        {selectedReport.analysisStatus === 'analyzing'
                                            ? 'AI analysis is in progress...'
                                            : selectedReport.analysisStatus === 'failed'
                                            ? 'AI analysis failed. Please try re-uploading the report.'
                                            : 'AI analysis pending. Please wait.'}
                                    </p>
                                </div>
                            )}
                            
                            <div className="mt-8 flex space-x-4">
                                <a
                                    href={selectedReport.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <Download className="h-5 w-5" />
                                    <span>Download Report</span>
                                </a>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                            
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Medical Disclaimer:</strong> AI analysis is for informational purposes only. 
                                    Consult healthcare professionals for medical advice.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsHistory;
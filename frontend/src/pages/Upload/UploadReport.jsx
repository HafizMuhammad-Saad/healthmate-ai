import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, Brain, Check, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadReport = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [uploadedReport, setUploadedReport] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [showUrdu, setShowUrdu] = useState(false);
    
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_BASE_URL;

    const handleFileSelect = (file) => {
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a valid file (JPEG, PNG, or PDF)');
                return;
            }

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should not exceed 10MB');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('report', selectedFile);

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post(`${baseURL}/upload`, formData, config);
            
            if (response.data.success) {
                setUploadedReport(response.data.data);
                toast.success('Report uploaded successfully!');
                
                // Automatically start analysis
                analyzeReport(response.data.data.reportId);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const analyzeReport = async (reportId) => {
        setAnalyzing(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.post(
                `${baseURL}/analyze/report/${reportId}`, 
                {}, 
                config
            );

            if (response.data.success) {
                setAnalysis(response.data.data);
                toast.success('Analysis completed!');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(error.response?.data?.message || 'Error analyzing report');
        } finally {
            setAnalyzing(false);
        }
    };

    const resetUpload = () => {
        setSelectedFile(null);
        setUploadedReport(null);
        setAnalysis(null);
        setShowUrdu(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Upload Medical Report
                    </h1>
                    <p className="text-gray-600">
                        Upload your medical reports to get AI-powered analysis in English and Roman Urdu
                    </p>
                </div>

                {!uploadedReport ? (
                    /* Upload Section */
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center mb-6">
                            <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900">Upload Your Report</h2>
                            <p className="text-gray-600 mt-2">
                                Supports PDF, JPEG, PNG files (Max 10MB)
                            </p>
                        </div>

                        {/* Drag & Drop Area */}
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragOver 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : selectedFile 
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            {selectedFile ? (
                                <div className="flex items-center justify-center space-x-4">
                                    {selectedFile.type.startsWith('image/') ? (
                                        <Image className="h-8 w-8 text-green-600" />
                                    ) : (
                                        <FileText className="h-8 w-8 text-red-600" />
                                    )}
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        Drag and drop your report here, or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block"
                                    >
                                        Choose File
                                    </label>
                                </>
                            )}
                        </div>

                        {/* Upload Button */}
                        {selectedFile && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={uploadFile}
                                    disabled={uploading}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto space-x-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            <span>Upload & Analyze</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Analysis Results Section */
                    <div className="space-y-6">
                        {/* Upload Success */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-4">
                                <Check className="h-8 w-8 text-green-600" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Report Uploaded Successfully
                                    </h3>
                                    <p className="text-gray-600">{uploadedReport.fileName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Status */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                                {analysis && (
                                    <div className="flex space-x-2">
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
                                )}
                            </div>

                            {analyzing ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
                                        <p className="text-gray-600">AI is analyzing your report...</p>
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mt-4"></div>
                                    </div>
                                </div>
                            ) : analysis ? (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            {showUrdu ? 'Roman Urdu Analysis:' : 'English Analysis:'}
                                        </h4>
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {showUrdu ? analysis.aiSummaryUr : analysis.aiSummaryEn}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => navigate('/reports')}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View All Reports
                                        </button>
                                        <button
                                            onClick={() => navigate('/insights')}
                                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Get Health Insights
                                        </button>
                                        <button
                                            onClick={resetUpload}
                                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Upload Another Report
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center py-4">
                                    Waiting for analysis to complete...
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Medical Disclaimer */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Medical Disclaimer:</strong> AI analysis is for informational purposes only. 
                        This should not replace professional medical advice, diagnosis, or treatment. 
                        Always consult qualified healthcare providers for medical concerns.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UploadReport;
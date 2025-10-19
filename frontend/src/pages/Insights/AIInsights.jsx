import { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, AlertCircle, Heart, Activity } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AIChat from './AiChat';

const AIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUrdu, setShowUrdu] = useState(false);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchHealthInsights();
    }, []);

    const fetchHealthInsights = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseURL}/analyze/insights`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInsights(response.data.data);
        } catch (error) {
            console.error('Fetch insights error:', error);
            toast.error('Error loading health insights');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">AI is analyzing your health data...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mt-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">AI Health Insights</h1>
                            <p className="text-gray-600">Personalized recommendations from your health data</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Brain className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               
                {insights ? (
                    <div className="space-y-8">
                        {/* Main Insights */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Brain className="h-8 w-8 text-purple-600" />
                                    <h2 className="text-2xl font-bold text-gray-900">Your Health Analysis</h2>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setShowUrdu(false)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            !showUrdu 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => setShowUrdu(true)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            showUrdu 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Roman Urdu
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {showUrdu ? (
                                            insights.insights.replace(/\n\n/g, '\n').split('\n').map((line, index) => (
                                                <span key={index}>
                                                    {line}
                                                    {index < insights.insights.split('\n').length - 1 && <br />}
                                                </span>
                                            ))
                                        ) : (
                                            insights.insights
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-blue-700 font-medium">Reports Analyzed</p>
                                    <p className="text-2xl font-bold text-blue-900">{insights.totalReports || 0}</p>
                                </div>
                                
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm text-green-700 font-medium">Data Sources</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {(insights.totalReports > 0 ? 1 : 0) + (insights.vitalsCount > 0 ? 1 : 0)}
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-sm text-purple-700 font-medium">Last Analysis</p>
                                    <p className="text-sm font-bold text-purple-900">
                                        {insights.lastAnalyzed ? 
                                            new Date(insights.lastAnalyzed).toLocaleDateString() : 
                                            'N/A'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Health Recommendations */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <Lightbulb className="h-8 w-8 text-yellow-500" />
                                <h3 className="text-xl font-bold text-gray-900">Recommended Actions</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Regular Monitoring</h4>
                                    <p className="text-blue-800 text-sm">
                                        Continue tracking your vitals regularly to monitor trends and changes in your health.
                                    </p>
                                </div>
                                
                                <div className="border-l-4 border-green-500 bg-green-50 p-4">
                                    <h4 className="font-semibold text-green-900 mb-2">Lifestyle Maintenance</h4>
                                    <p className="text-green-800 text-sm">
                                        Keep up with healthy habits like regular exercise, balanced diet, and adequate sleep.
                                    </p>
                                </div>
                                
                                <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                                    <h4 className="font-semibold text-purple-900 mb-2">Medical Follow-up</h4>
                                    <p className="text-purple-800 text-sm">
                                        Schedule regular check-ups with your healthcare provider to discuss your reports.
                                    </p>
                                </div>
                                
                                <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                                    <h4 className="font-semibold text-orange-900 mb-2">Data Consistency</h4>
                                    <p className="text-orange-800 text-sm">
                                        Try to record vitals at consistent times for more accurate trend analysis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h4>
                                    <p className="text-yellow-700 text-sm leading-relaxed">
                                        {insights.disclaimer || 
                                        "These AI-generated insights are for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding your health concerns and before making any changes to your healthcare routine."
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* No Data State */
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Health Data Available</h2>
                        <p className="text-gray-600 mb-8">
                            Upload medical reports and track your vitals to get personalized AI-powered health insights.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/upload"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Upload Medical Report
                            </a>
                            <a
                                href="/vitals"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Track Vitals
                            </a>
                        </div>
                    </div>
                )}
            
            </div>
        </div>
    );
};

export default AIInsights;
import { useState, useEffect } from 'react';
import { 
    Heart, 
    Activity, 
    Scale, 
    Droplets, 
    Thermometer,
    Plus,
    Edit,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const VitalsTracker = () => {
    const [vitals, setVitals] = useState([]);
    const [stats, setStats] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        sugarType: 'random',
        weight: '',
        pulse: '',
        temperature: '',
        height: '',
        oxygenSaturation: '',
        notes: ''
    });
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchVitals();
        fetchStats();
    }, []);

    const fetchVitals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseURL}/vitals?limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVitals(response.data.data || []);
        } catch (error) {
            console.error('Fetch vitals error:', error);
            toast.error('Error loading vitals');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseURL}/vitals/stats?days=30`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data);
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out empty values
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => v !== '')
        );

         // Check if any vital value is unrealistic
    if (filteredData.bloodSugar < 40 || filteredData.temperature < 95 || filteredData.oxygenSaturation < 70) {
        alert("Please enter realistic vital values");
        return;
    }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${baseURL}/vitals`, filteredData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Vitals recorded successfully!');
            setShowAddForm(false);
            setFormData({
                systolic: '',
                diastolic: '',
                bloodSugar: '',
                sugarType: 'random',
                weight: '',
                pulse: '',
                temperature: '',
                height: '',
                oxygenSaturation: '',
                notes: ''
            });
            fetchVitals();
            fetchStats();
        } catch (error) {
            console.error('Add vital error:', error);
            toast.error(error.response?.data?.message || 'Error recording vitals');
        }
    };

    // eslint-disable-next-line no-unused-vars
    const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value || 'No data'}</p>
                    {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
                </div>
                <Icon className="h-8 w-8" style={{ color }} />
            </div>
        </div>
    );

    const formatChartData = (trend) => {
        return trend?.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            })
        })) || [];
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
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Vitals Tracker</h1>
                            <p className="text-gray-600">Monitor your health vitals</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Reading</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {stats && stats.totalReadings > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Activity}
                            title="Blood Pressure"
                            value={stats.bloodPressure?.avgSystolic ? 
                                `${stats.bloodPressure.avgSystolic}/${stats.bloodPressure.avgDiastolic}` : 
                                'No data'
                            }
                            subtitle="30-day average"
                            color="#EF4444"
                        />
                        <StatCard
                            icon={Droplets}
                            title="Blood Sugar"
                            value={stats.bloodSugar?.avgLevel ? `${stats.bloodSugar.avgLevel} mg/dL` : 'No data'}
                            subtitle="30-day average"
                            color="#F59E0B"
                        />
                        <StatCard
                            icon={Scale}
                            title="Weight"
                            value={stats.weight?.avgWeight ? `${stats.weight.avgWeight} kg` : 'No data'}
                            subtitle="30-day average"
                            color="#10B981"
                        />
                        <StatCard
                            icon={Heart}
                            title="Heart Rate"
                            value={stats.pulse?.avgPulse ? `${stats.pulse.avgPulse} bpm` : 'No data'}
                            subtitle="30-day average"
                            color="#8B5CF6"
                        />
                    </div>
                )}

                {/* Charts */}
                {stats && stats.totalReadings > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Blood Pressure Chart */}
                        {stats.bloodPressure?.trend?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Blood Pressure Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={formatChartData(stats.bloodPressure.trend)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line 
                                            type="monotone" 
                                            dataKey="systolic" 
                                            stroke="#EF4444" 
                                            name="Systolic"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="diastolic" 
                                            stroke="#F97316" 
                                            name="Diastolic"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Weight Chart */}
                        {stats.weight?.trend?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Weight Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={formatChartData(stats.weight.trend)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area 
                                            type="monotone" 
                                            dataKey="weight" 
                                            stroke="#10B981" 
                                            fill="#10B981"
                                            fillOpacity={0.3}
                                            name="Weight (kg)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Readings */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Readings</h3>
                    </div>
                    
                    {vitals.length > 0 ? (
                        <div className="divide-y">
                            {vitals.map((vital) => (
                                <div key={vital._id} className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-gray-600">
                                            {new Date(vital.recordedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {vital.systolic && vital.diastolic && (
                                            <div>
                                                <p className="text-sm text-gray-600">Blood Pressure</p>
                                                <p className="font-medium">{vital.systolic}/{vital.diastolic}</p>
                                            </div>
                                        )}
                                        
                                        {vital.bloodSugar && (
                                            <div>
                                                <p className="text-sm text-gray-600">Blood Sugar</p>
                                                <p className="font-medium">{vital.bloodSugar} mg/dL</p>
                                                <p className="text-xs text-gray-500">({vital.sugarType})</p>
                                            </div>
                                        )}
                                        
                                        {vital.weight && (
                                            <div>
                                                <p className="text-sm text-gray-600">Weight</p>
                                                <p className="font-medium">{vital.weight} kg</p>
                                            </div>
                                        )}
                                        
                                        {vital.pulse && (
                                            <div>
                                                <p className="text-sm text-gray-600">Heart Rate</p>
                                                <p className="font-medium">{vital.pulse} bpm</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {vital.notes && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            <strong>Notes:</strong> {vital.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No vitals recorded yet</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Record First Reading
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Vital Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Record Vitals</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Blood Pressure */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Pressure (mmHg)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Systolic"
                                        value={formData.systolic}
                                        onChange={(e) => setFormData({...formData, systolic: e.target.value})}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Diastolic"
                                        value={formData.diastolic}
                                        onChange={(e) => setFormData({...formData, diastolic: e.target.value})}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Blood Sugar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Sugar (mg/dL)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Blood Sugar Level"
                                        value={formData.bloodSugar}
                                        onChange={(e) => setFormData({...formData, bloodSugar: e.target.value})}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={formData.sugarType}
                                        onChange={(e) => setFormData({...formData, sugarType: e.target.value})}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="fasting">Fasting</option>
                                        <option value="random">Random</option>
                                        <option value="post_meal">Post Meal</option>
                                        <option value="hba1c">HbA1c</option>
                                    </select>
                                </div>
                            </div>

                            {/* Other Vitals */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heart Rate (bpm)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.pulse}
                                        onChange={(e) => setFormData({...formData, pulse: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Temperature (°F)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.temperature}
                                        onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Oxygen Saturation (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.oxygenSaturation}
                                        onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Any additional notes about your health today..."
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Reading
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VitalsTracker;
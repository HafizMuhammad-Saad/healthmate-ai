const Vital = require('../models/Vital');

// Add new vital reading
const addVital = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            systolic,
            diastolic,
            bloodSugar,
            sugarType,
            weight,
            pulse,
            temperature,
            height,
            oxygenSaturation,
            notes,
            recordedAt
        } = req.body;

        // Validate that at least one measurement is provided
        const measurements = [systolic, diastolic, bloodSugar, weight, pulse, temperature, oxygenSaturation];
        if (measurements.every(m => !m)) {
            return res.status(400).json({
                success: false,
                message: 'At least one vital measurement is required'
            });
        }

        const vital = new Vital({
            userId,
            systolic,
            diastolic,
            bloodSugar,
            sugarType,
            weight,
            pulse,
            temperature,
            height,
            oxygenSaturation,
            notes,
            recordedAt: recordedAt || new Date()
        });

        await vital.save();

        res.status(201).json({
            success: true,
            message: 'Vital signs recorded successfully',
            data: vital
        });

    } catch (error) {
        console.error('Add vital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording vital signs',
            error: error.message
        });
    }
};

// Get user's vitals with pagination and filtering
const getUserVitals = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            page = 1, 
            limit = 20, 
            startDate, 
            endDate,
            type 
        } = req.query;

        let query = { userId };

        // Date range filter
        if (startDate && endDate) {
            query.recordedAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const vitals = await Vital.find(query)
            .sort({ recordedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Vital.countDocuments(query);

        res.status(200).json({
            success: true,
            data: vitals,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get vitals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vitals',
            error: error.message
        });
    }
};

// Get vital statistics and trends
const getVitalStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const vitals = await Vital.find({
            userId,
            recordedAt: { $gte: startDate }
        }).sort({ recordedAt: 1 });

        if (vitals.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalReadings: 0,
                    message: 'No vital readings found for the specified period'
                }
            });
        }

        // Calculate statistics
        const stats = {
            totalReadings: vitals.length,
            period: `Last ${days} days`,
            bloodPressure: {
                readings: vitals.filter(v => v.systolic && v.diastolic).length,
                avgSystolic: null,
                avgDiastolic: null,
                trend: []
            },
            bloodSugar: {
                readings: vitals.filter(v => v.bloodSugar).length,
                avgLevel: null,
                trend: []
            },
            weight: {
                readings: vitals.filter(v => v.weight).length,
                avgWeight: null,
                trend: [],
                bmi: []
            },
            pulse: {
                readings: vitals.filter(v => v.pulse).length,
                avgPulse: null,
                trend: []
            }
        };

        // Blood Pressure Stats
        const bpReadings = vitals.filter(v => v.systolic && v.diastolic);
        if (bpReadings.length > 0) {
            stats.bloodPressure.avgSystolic = Math.round(
                bpReadings.reduce((sum, v) => sum + v.systolic, 0) / bpReadings.length
            );
            stats.bloodPressure.avgDiastolic = Math.round(
                bpReadings.reduce((sum, v) => sum + v.diastolic, 0) / bpReadings.length
            );
            stats.bloodPressure.trend = bpReadings.map(v => ({
                date: v.recordedAt,
                systolic: v.systolic,
                diastolic: v.diastolic
            }));
        }

        // Blood Sugar Stats
        const sugarReadings = vitals.filter(v => v.bloodSugar);
        if (sugarReadings.length > 0) {
            stats.bloodSugar.avgLevel = Math.round(
                sugarReadings.reduce((sum, v) => sum + v.bloodSugar, 0) / sugarReadings.length
            );
            stats.bloodSugar.trend = sugarReadings.map(v => ({
                date: v.recordedAt,
                level: v.bloodSugar,
                type: v.sugarType
            }));
        }

        // Weight Stats
        const weightReadings = vitals.filter(v => v.weight);
        if (weightReadings.length > 0) {
            stats.weight.avgWeight = Math.round(
                (weightReadings.reduce((sum, v) => sum + v.weight, 0) / weightReadings.length) * 10
            ) / 10;
            stats.weight.trend = weightReadings.map(v => ({
                date: v.recordedAt,
                weight: v.weight,
                bmi: v.bmi || null
            }));
        }

        // Pulse Stats
        const pulseReadings = vitals.filter(v => v.pulse);
        if (pulseReadings.length > 0) {
            stats.pulse.avgPulse = Math.round(
                pulseReadings.reduce((sum, v) => sum + v.pulse, 0) / pulseReadings.length
            );
            stats.pulse.trend = pulseReadings.map(v => ({
                date: v.recordedAt,
                pulse: v.pulse
            }));
        }

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get vital stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating vital statistics',
            error: error.message
        });
    }
};

// Update vital reading
const updateVital = async (req, res) => {
    try {
        const { vitalId } = req.params;
        const userId = req.user._id;

        const vital = await Vital.findOne({ _id: vitalId, userId });
        
        if (!vital) {
            return res.status(404).json({
                success: false,
                message: 'Vital reading not found'
            });
        }

        Object.assign(vital, req.body);
        await vital.save();

        res.status(200).json({
            success: true,
            message: 'Vital reading updated successfully',
            data: vital
        });

    } catch (error) {
        console.error('Update vital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vital reading',
            error: error.message
        });
    }
};

// Delete vital reading
const deleteVital = async (req, res) => {
    try {
        const { vitalId } = req.params;
        const userId = req.user._id;

        const vital = await Vital.findOneAndDelete({ _id: vitalId, userId });
        
        if (!vital) {
            return res.status(404).json({
                success: false,
                message: 'Vital reading not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vital reading deleted successfully'
        });

    } catch (error) {
        console.error('Delete vital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting vital reading',
            error: error.message
        });
    }
};

module.exports = {
    addVital,
    getUserVitals,
    getVitalStats,
    updateVital,
    deleteVital
};
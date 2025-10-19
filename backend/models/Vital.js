const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Blood Pressure
    systolic: {
        type: Number,
        min: 60,
        max: 250
    },
    diastolic: {
        type: Number,
        min: 40,
        max: 150
    },
    // Blood Sugar (mg/dL)
    bloodSugar: {
        type: Number,
        min: 40,
        max: 600
    },
    sugarType: {
        type: String,
        enum: ['fasting', 'random', 'post_meal', 'hba1c'],
        default: 'random'
    },
    // Weight (kg)
    weight: {
        type: Number,
        min: 20,
        max: 500
    },
    // Heart Rate (bpm)
    pulse: {
        type: Number,
        min: 40,
        max: 200
    },
    // Temperature (°F)
    temperature: {
        type: Number,
        min: 95,
        max: 110
    },
    // Additional measurements
    height: {
        type: Number, // in cm
        min: 100,
        max: 250
    },
    oxygenSaturation: {
        type: Number, // percentage
        min: 70,
        max: 100
    },
    notes: String,
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate BMI virtual field
vitalSchema.virtual('bmi').get(function() {
    if (this.weight && this.height) {
        const heightInM = this.height / 100;
        return Math.round((this.weight / (heightInM * heightInM)) * 10) / 10;
    }
    return null;
});

// Index for efficient querying
vitalSchema.index({ userId: 1, recordedAt: -1 });
vitalSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Vital', vitalSchema);
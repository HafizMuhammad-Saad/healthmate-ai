const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'pdf'],
        required: true
    },
    cloudinaryPublicId: String,
    aiSummaryEn: {
        type: String,
        default: null
    },
    aiSummaryUr: {
        type: String,
        default: null
    },
    analysisStatus: {
        type: String,
        enum: ['pending', 'analyzing', 'completed', 'failed'],
        default: 'pending'
    },
    reportType: {
        type: String,
        enum: ['blood_test', 'x_ray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'general', 'other'],
        default: 'general'
    },
    tags: [String],
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model('Report', reportSchema);
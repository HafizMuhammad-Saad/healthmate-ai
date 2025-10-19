const cloudinary = require('cloudinary').v2;
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and PDFs only
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
        }
    }
});

// Upload medical report
const uploadReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const userId = req.user._id;
        const file = req.file;
        
        // Determine file type
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'pdf';
        
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'healthmate-reports',
                    resource_type: 'auto',
                    public_id: `${userId}_${Date.now()}`,
                    format: fileType === 'pdf' ? 'pdf' : undefined
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(file.buffer);
        });

        // Create report record in database
        const report = new Report({
            userId: userId,
            fileName: file.originalname,
            fileUrl: uploadResult.secure_url,
            fileType: fileType,
            cloudinaryPublicId: uploadResult.public_id,
            analysisStatus: 'pending'
        });

        await report.save();

        res.status(201).json({
            success: true,
            message: 'Report uploaded successfully',
            data: {
                reportId: report._id,
                fileName: report.fileName,
                fileUrl: report.fileUrl,
                fileType: report.fileType,
                uploadedAt: report.createdAt
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading report',
            error: error.message
        });
    }
};

// Get user's reports
const getUserReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, status, type } = req.query;

        let query = { userId, isArchived: false };
        
        if (status) {
            query.analysisStatus = status;
        }
        
        if (type) {
            query.reportType = type;
        }

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('userId', 'name email');

        const total = await Report.countDocuments(query);

        res.status(200).json({
            success: true,
            data: reports,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reports',
            error: error.message
        });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const userId = req.user._id;

        const report = await Report.findOne({ _id: reportId, userId });
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Delete from Cloudinary
        if (report.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(report.cloudinaryPublicId, {
                resource_type: report.fileType === 'image' ? 'image' : 'raw'
            });
        }

        // Delete from database
        await Report.findByIdAndDelete(reportId);

        res.status(200).json({
            success: true,
            message: 'Report deleted successfully'
        });

    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting report',
            error: error.message
        });
    }
};

module.exports = {
    upload,
    uploadReport,
    getUserReports,
    deleteReport
};
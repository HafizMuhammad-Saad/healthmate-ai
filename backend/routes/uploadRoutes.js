const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
    upload, 
    uploadReport, 
    getUserReports, 
    deleteReport 
} = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload - Upload medical report
router.post('/', protect, upload.single('report'), uploadReport);

// GET /api/upload/reports - Get user's reports
router.get('/reports', protect, getUserReports);

// DELETE /api/upload/reports/:reportId - Delete specific report
router.delete('/reports/:reportId', protect, deleteReport);

module.exports = router;
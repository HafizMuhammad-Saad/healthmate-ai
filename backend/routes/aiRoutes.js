const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
    analyzeReport, 
    getHealthInsights,
    chatWithAI 
} = require('../controllers/aiController');

const router = express.Router();

// POST /api/analyze/:reportId - Analyze uploaded report
router.post('/report/:reportId', protect, analyzeReport);

// GET /api/analyze/insights - Get personalized health insights
router.get('/insights', protect, getHealthInsights);

router.post('/chat', protect, chatWithAI);


module.exports = router;
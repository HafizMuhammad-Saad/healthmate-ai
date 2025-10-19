const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
    addVital, 
    getUserVitals, 
    getVitalStats, 
    updateVital, 
    deleteVital 
} = require('../controllers/vitalsController');

const router = express.Router();

// POST /api/vitals - Add new vital reading
router.post('/', protect, addVital);

// GET /api/vitals - Get user's vital readings
router.get('/', protect, getUserVitals);

// GET /api/vitals/stats - Get vital statistics and trends
router.get('/stats', protect, getVitalStats);

// PUT /api/vitals/:vitalId - Update vital reading
router.put('/:vitalId', protect, updateVital);

// DELETE /api/vitals/:vitalId - Delete vital reading
router.delete('/:vitalId', protect, deleteVital);

module.exports = router;
const express = require('express');
const {
    updateProfile,
    getPublicProfile,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

//protected routes
router.put('/profile', protect, updateProfile);

//public routes
router.get('/:id', getPublicProfile);

module.exports = router;
const express = require('express');
const {register, login, getMe} = require('../controllers/authController');
const {protect} = require('../middlewares/authMiddleware');
const {upload, uploadToCloudinary} = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file);

        res.status(200).json({
            success: true,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });

    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message
        });
    }
});

module.exports = router;
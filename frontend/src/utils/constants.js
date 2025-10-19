export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_URL = import.meta.env.VITE_BASE_URL;

// Cloudinary configuration (if needed on frontend)
export const CLOUDINARY_CONFIG = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

// App configuration
export const APP_CONFIG = {
    name: 'HealthMate AI',
    tagline: 'Sehat ka Smart Dost',
    // version: '1.0.0'
};
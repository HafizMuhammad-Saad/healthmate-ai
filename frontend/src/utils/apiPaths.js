export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register", // Signup
    LOGIN: "/auth/login",       // Authenticate user & return JWT token
    GET_PROFILE: "/auth/me",    // Get logged-in user details
    UPLOAD_IMAGE: "/auth/upload-image", // Upload profile picture
  },

  UPLOAD: {
    UPLOAD_REPORT: "/upload",           // Upload medical report
    GET_REPORTS: "/upload/reports",     // Get user's reports
    DELETE_REPORT: (id) => `/upload/reports/${id}`, // Delete specific report
  },

  ANALYZE: {
    ANALYZE_REPORT: (id) => `/analyze/report/${id}`, // Analyze uploaded report
    GET_INSIGHTS: "/analyze/insights",   // Get personalized health insights
  },

  VITALS: {
    ADD_VITAL: "/vitals",               // Add new vital reading
    GET_VITALS: "/vitals",              // Get user's vital readings
    GET_STATS: "/vitals/stats",         // Get vital statistics and trends
    UPDATE_VITAL: (id) => `/vitals/${id}`, // Update vital reading
    DELETE_VITAL: (id) => `/vitals/${id}`, // Delete vital reading
  },

  USER: {
    UPDATE_PROFILE: "/user/profile",    // Update profile details
  },

};

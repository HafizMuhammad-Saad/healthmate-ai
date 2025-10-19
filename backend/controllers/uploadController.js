const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const Report = require("../models/Report");

// ✅ Optional: used later for text extraction, not during upload
const axios = require("axios");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

// =============================
// Cloudinary configuration
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================
// Multer memory storage
// =============================
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and PDF allowed."), false);
  },
});

// =============================
// Upload Report
// =============================
// const uploadReport = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file uploaded" });

//     const userId = req.user._id;
//     const file = req.file;
//     const fileType = file.mimetype.startsWith("image/") ? "image" : "pdf";

//     // ✅ Upload to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "healthmate-reports",
//           resource_type: "auto",
//           access_mode: "public",
//           public_id: `${userId}_${Date.now()}`,
//           format: fileType === "pdf" ? "pdf" : undefined,
//         },
//         (err, result) => (err ? reject(err) : resolve(result))
//       );
//       stream.end(file.buffer);
//     });

//     // ✅ Save metadata only (AI handles extraction later)
//     const report = await Report.create({
//       userId,
//       fileName: file.originalname,
//       fileUrl: uploadResult.secure_url,
//       fileType,
//       cloudinaryPublicId: uploadResult.public_id,
//       analysisStatus: "pending",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Report uploaded successfully",
//       data: {
//         reportId: report._id,
//         fileName: report.fileName,
//         fileUrl: report.fileUrl,
//         fileType: report.fileType,
//         uploadedAt: report.createdAt,
//       },
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error uploading report",
//       error: err.message,
//     });
//   }
// };

const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user._id;
    const file = req.file;
    const fileType = file.mimetype.startsWith("image/") ? "image" : "pdf";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "healthmate-reports",
          resource_type: "auto", // Keep this as auto
          access_mode: "public",
          public_id: `${userId}_${Date.now()}`,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(file.buffer);
    });

    // ✅ Save metadata INCLUDING the resource_type returned by Cloudinary
    const report = await Report.create({
      userId,
      fileName: file.originalname,
      fileUrl: uploadResult.secure_url,
      fileType,
      cloudinaryPublicId: uploadResult.public_id,
      // ✨ SAVE THIS VALUE FROM CLOUDINARY'S RESPONSE
      cloudinaryResourceType: uploadResult.resource_type, 
      analysisStatus: "pending",
    });

    res.status(201).json({
        success: true,
        message: "Report uploaded successfully",
        data: {
            reportId: report._id,
            //... other data
        }
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading report",
      error: err.message,
    });
  }
};
// =============================
// Get User Reports
// =============================
const getUserReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, type } = req.query;

    const query = { userId, isArchived: false };
    if (status) query.analysisStatus = status;
    if (type) query.fileType = type;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "name email");

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    console.error("Get reports error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: err.message,
    });
  }
};

// =============================
// Delete Report
// =============================
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (report.cloudinaryPublicId) {
      // ✅ Use the SAVED resource_type for reliable deletion
      await cloudinary.uploader.destroy(report.cloudinaryPublicId, {
        resource_type: report.cloudinaryResourceType || (report.fileType === 'image' ? 'image' : 'raw'),
      });
    }

    await Report.findByIdAndDelete(reportId);

    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting report",
      error: err.message,
    });
  }
};

module.exports = { upload, uploadReport, getUserReports, deleteReport };

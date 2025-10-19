const { GoogleGenerativeAI } = require("@google/generative-ai");
const Report = require("../models/Report");
const pdfParse = require("pdf-parse");
const axios = require("axios");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Helper function: choose the best available model
const getModel = (type = "text") => {
  try {
    if (type === "vision") return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  } catch {
    return genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  }
};

// 🧩 Analyze medical report
const analyzeReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    report.analysisStatus = "analyzing";
    await report.save();

    let extractedText = "";
    let isImage = report.fileType === "image";

    try {
      // 📘 Extract text
      if (report.fileType === "pdf") {
        const response = await axios.get(report.fileUrl, { responseType: "arraybuffer" });
        const pdfData = await pdfParse(Buffer.from(response.data));
        extractedText = pdfData.text || "";
      } else if (isImage) {
        extractedText = `
          [Image Detected] This appears to be a photo-based medical report.
          Use OCR (text extraction) or manually uploaded report text for detailed analysis.
        `;
      }

      // ✨ English Prompt (strong medical logic & empathy)
      const englishPrompt = `
You are HealthMate AI — a medical analysis assistant.
Analyze the following medical report for a general user (non-doctor).
Focus on clarity, empathy, and helpfulness.

Guidelines:
1. Explain test names in simple, plain English (no jargon).
2. Highlight abnormal values (high/low).
3. Offer practical, everyday wellness or diet tips if relevant.
4. Be concise (max 200 words).
5. Always remind that the information is not medical advice.
6. End with a friendly health encouragement note.

Medical Report Text:
${extractedText}

Now write a short, compassionate summary:
`;

      const model = getModel(isImage ? "vision" : "text");
      const englishResult = await model.generateContent(englishPrompt);
      const englishSummary = englishResult.response.text().trim();

      // ✨ Roman Urdu version
      const urduPrompt = `
Translate the following English medical summary into clear Roman Urdu (Urdu written in English letters).
Keep the tone gentle and supportive. Avoid medical jargon.

English Summary:
${englishSummary}

Roman Urdu Translation:
`;

      const urduResult = await model.generateContent(urduPrompt);
      const urduSummary = urduResult.response.text().trim();

      // ✅ Save both results
      Object.assign(report, {
        aiSummaryEn: englishSummary,
        aiSummaryUr: urduSummary,
        analysisStatus: "completed",
      });
      await report.save();

      res.status(200).json({
        success: true,
        message: "Report analyzed successfully",
        data: {
          reportId: report._id,
          aiSummaryEn: englishSummary,
          aiSummaryUr: urduSummary,
          analysisStatus: "completed",
        },
      });
    } catch (aiError) {
      console.error("AI Analysis Error:", aiError);

      // ❗ Fallback if AI or PDF parsing fails
      report.analysisStatus = "failed";
      await report.save();

      const fallbackEnglish = `
HealthMate AI could not automatically analyze your report.
Please ensure it contains readable text or use OCR extraction.
For accurate interpretation, consult your healthcare provider.
`;
      const fallbackUrdu = `
HealthMate AI report ka automatic analysis nahi kar saka.
Report ka text readable hona chahiye. Sahi maloomat ke liye doctor se mashwara karein.
`;

      res.status(200).json({
        success: true,
        message: "Analysis completed with fallback message",
        data: {
          reportId: report._id,
          aiSummaryEn: fallbackEnglish.trim(),
          aiSummaryUr: fallbackUrdu.trim(),
          analysisStatus: "failed",
        },
      });
    }
  } catch (error) {
    console.error("Analyze report error:", error);
    res.status(500).json({ success: false, message: "Error analyzing report", error: error.message });
  }
};

// 📊 Health Insights (multi-report pattern analysis)
const getHealthInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const recentReports = await Report.find({
      userId,
      analysisStatus: "completed",
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (recentReports.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reports available for insights",
        data: {
          insights:
            "Upload and analyze medical reports to get personalized HealthMate AI insights about your well-being.",
          recommendations: [],
        },
      });
    }

    const summaries = recentReports
      .map((r) => `Report (${r.createdAt.toDateString()}): ${r.aiSummaryEn}`)
      .join("\n\n");

    const insightsPrompt = `
You are HealthMate AI, a compassionate wellness analyst.
Review the following summaries of recent medical reports and identify health patterns.

Guidelines:
1. Detect trends (e.g., improving, stable, or concerning).
2. Offer simple lifestyle or nutrition tips.
3. Avoid any medical diagnosis.
4. Keep response under 300 words.
5. Use warm, human-friendly tone.
6. End with a motivational wellness note.

Reports:
${summaries}

Generate an insightful health overview:
`;

    const model = getModel();
    const result = await model.generateContent(insightsPrompt);
    const insights = result.response.text().trim();

    res.status(200).json({
      success: true,
      data: {
        insights,
        totalReports: recentReports.length,
        lastAnalyzed: recentReports[0]?.createdAt,
        disclaimer:
          "HealthMate AI provides general wellness insights only. This is not medical advice.",
      },
    });
  } catch (error) {
    console.error("Health insights error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating health insights",
      error: error.message,
    });
  }
};

module.exports = { analyzeReport, getHealthInsights };

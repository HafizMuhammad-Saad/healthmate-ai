const { GoogleGenerativeAI } = require("@google/generative-ai");
const Report = require("../models/Report");
const pdfParse = require("pdf-parse");
const axios = require("axios");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Helper function: choose the best available model
const getModel = (isVision = false) => {
  // Use gemini-1.5-flash for text and gemini-1.5-pro for vision/multimodal
  const modelName = isVision ? "gemini-2.5-flash" : "gemini-2.5-flash";
  return genAI.getGenerativeModel({ model: modelName });
};

// ✨ NEW HELPER: Converts a file URL to a GoogleGenerativeAI.Part object
const urlToGenerativePart = async (url, mimeType) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
};

// 🧩 Analyze medical report (FULLY CORRECTED)
// ✅ Main controller
const analyzeReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    // Assuming req.user is populated by authentication middleware
    const userId = req.user._id;

    // Report is a Mongoose model, assuming it's available
    // const Report = require('../models/Report'); 
    
    const report = await Report.findOne({ _id: reportId, userId });
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found" });

    report.analysisStatus = "analyzing";
    await report.save();

    const isImage = report.fileType === "image";

    // Defining the prompt and required JSON structure
    const combinedPrompt = `
You are HealthMate AI — a friendly medical report analyzer.

Please:
1. Explain test results in simple, plain English.
2. Highlight abnormal values (high/low).
3. Provide general wellness or diet tips.
4. Be concise (under 200 words).
5. End with a friendly motivational note.
6. Translate your English summary into Roman Urdu.
7. Return JSON only in this format:
{
  "englishSummary": "...",
  "urduSummary": "..."
}
`;

    let result;
    let extractedText = "";

    if (isImage) {
      // ✅ Vision model input (image)
      // Assuming getModel(true) returns a vision-capable Gemini model client
      const model = getModel(true); 
      // Assuming urlToGenerativePart is correctly implemented
      const imagePart = await urlToGenerativePart(report.fileUrl, "image/jpeg"); 

      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: combinedPrompt }, imagePart],
          },
        ],
      });
    } else {
      // ✅ Text model input (PDF)
      // IMPORTANT: The 401 error is likely here. If report.fileUrl is protected
      // (e.g., S3, Google Cloud Storage), you MUST add authentication headers (e.g., 
      // a Bearer token or pre-signed URL headers) to the Axios request.
      
      const model = getModel(false);
      
      const response = await axios.get(report.fileUrl, { 
          responseType: "arraybuffer",
          // *** ADD AUTH HEADERS HERE IF FILE URL IS PROTECTED ***
          // headers: { 
          //   'Authorization': 'Bearer YOUR_TOKEN_OR_KEY'
          // }
      });
      
      // Assuming pdfParse and Buffer are correctly imported/available
      const pdfData = await pdfParse(Buffer.from(response.data)); 
      extractedText = pdfData.text || "No readable text found.";

      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: combinedPrompt },
              { text: `Medical Report Text:\n${extractedText}` },
            ],
          },
        ],
      });
    }

    // ✅ Extract response
    const responseText = result.response.text().trim();
    const cleaned = responseText.replace(/```json|```/g, "").trim();

    let englishSummary = "";
    let urduSummary = "";

    try {
      const parsed = JSON.parse(cleaned);
      englishSummary = parsed.englishSummary || "";
      urduSummary = parsed.urduSummary || "";
    } catch (err) {
      console.error("⚠️ Invalid AI JSON output:", cleaned);
      englishSummary =
        "HealthMate AI could not automatically analyze this report. Please ensure it contains readable text or use OCR extraction.";
      urduSummary =
        "HealthMate AI report ka automatic analysis nahi kar saka. Barah-e-karam readable text ya clear PDF upload karein.";
    }

    // ✅ Save result
    report.aiSummaryEn = englishSummary;
    report.aiSummaryUr = urduSummary;
    report.analysisStatus = "completed";
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
  } catch (error) {
    console.error("❌ Analyze report error:", error);

    // --- ENHANCED ERROR HANDLING FOR AXIOS/EXTERNAL CALLS ---
    // Check if the error is an AxiosError with a response status
    if (error.response) {
      const status = error.response.status;
      
      // Handle 401 (Unauthorized) and 403 (Forbidden) issues specifically.
      if (status === 401 || status === 403) {
        // This is often an issue with the file URL's access or the Gemini API key.
        return res.status(403).json({
          success: false,
          message: `External resource access failed (Status: ${status}). Please check the authentication/access for the file URL or the external API key.`,
          error: error.message,
        });
      }
      
      // Handle external server errors (5xx)
      if (status >= 500 && status < 600) {
        // Use 502 Bad Gateway to indicate that an upstream service failed
        return res.status(502).json({
          success: false,
          message: `External API service failed with status ${status}.`,
          error: error.message,
        });
      }
      
      // Handle other client-side external errors (e.g., 404 from file server)
      return res.status(400).json({
        success: false,
        message: `External resource error: Status ${status}.`,
        error: error.message,
      });
    }
    
    // Handle all other errors (database, internal logic, etc.) with a generic 500
    // And ensure the report status is updated to reflect the failure
    try {
        if (reportId) { // Try to find and update the report status on failure
            await Report.findByIdAndUpdate(reportId, { analysisStatus: "failed" });
        }
    } catch(dbUpdateError) {
        console.error("Failed to update report status on analysis failure:", dbUpdateError);
    }

    res.status(500).json({
      success: false,
      message: "An unexpected internal server error occurred during report analysis.",
      error: error.message,
    });
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

// 💬 AI Chat Assistant
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const model = getModel("text");

    const chatPrompt = `
You are HealthMate AI, a friendly virtual health assistant.
Use empathy, kindness, and accuracy. Keep replies short and practical (under 150 words).
If the user asks about medical symptoms, include a clear disclaimer:
"This is general information only. Please consult a healthcare provider for personal advice."

Previous Context (if any):
${context || "None"}

User Message:
${message}

AI Response:
`;

    const aiResponse = await model.generateContent(chatPrompt);
    const reply = aiResponse.response.text().trim();

    res.status(200).json({
      success: true,
      data: {
        reply,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in AI Chat",
      error: error.message,
    });
  }
};

module.exports = { analyzeReport, getHealthInsights, chatWithAI };



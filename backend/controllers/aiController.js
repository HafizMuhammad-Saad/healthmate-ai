const { GoogleGenerativeAI } = require('@google/generative-ai');
const Report = require('../models/Report');
const pdfParse = require('pdf-parse');
const axios = require('axios');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze medical report
const analyzeReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const userId = req.user._id;

        // Find the report
        const report = await Report.findOne({ _id: reportId, userId });
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Update status to analyzing
        report.analysisStatus = 'analyzing';
        await report.save();

        let extractedText = '';

        try {
            // Extract text based on file type
            if (report.fileType === 'pdf') {
                // Download PDF and extract text
                const response = await axios.get(report.fileUrl, { 
                    responseType: 'arraybuffer' 
                });
                const pdfBuffer = Buffer.from(response.data);
                const pdfData = await pdfParse(pdfBuffer);
                extractedText = pdfData.text;
            } else if (report.fileType === 'image') {
                // For images, we'll use Gemini Vision (if available) or provide a fallback
                extractedText = 'Image-based medical report uploaded. Please provide manual analysis or use OCR.';
            }

            // Create AI prompts
            const englishPrompt = `
                You are a medical AI assistant. Analyze the following medical report and provide a clear, simple explanation in English.
                
                IMPORTANT GUIDELINES:
                1. Use simple, non-technical language
                2. Explain what the tests mean
                3. Highlight any values that seem abnormal (high/low)
                4. Suggest general wellness tips if appropriate
                5. Always remind that this is for informational purposes only
                6. Keep response under 200 words
                
                Medical Report Content:
                ${extractedText}
                
                Provide a clear, helpful summary:
            `;

            const urduPrompt = `
                Translate the following medical analysis into Roman Urdu (Urdu written in English letters). 
                Keep it simple and easy to understand for common people.
                Keep it under 150 words.
                
                English Analysis: {ENGLISH_ANALYSIS}
                
                Roman Urdu Translation:
            `;

            // Get AI model
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // Generate English summary
            const englishResult = await model.generateContent(englishPrompt);
            const englishSummary = englishResult.response.text();

            // Generate Roman Urdu summary
            const urduPromptFinal = urduPrompt.replace('{ENGLISH_ANALYSIS}', englishSummary);
            const urduResult = await model.generateContent(urduPromptFinal);
            const urduSummary = urduResult.response.text();

            // Update report with AI summaries
            report.aiSummaryEn = englishSummary;
            report.aiSummaryUr = urduSummary;
            report.analysisStatus = 'completed';
            await report.save();

            res.status(200).json({
                success: true,
                message: 'Report analyzed successfully',
                data: {
                    reportId: report._id,
                    aiSummaryEn: englishSummary,
                    aiSummaryUr: urduSummary,
                    analysisStatus: 'completed'
                }
            });

        } catch (aiError) {
            console.error('AI Analysis Error:', aiError);
            
            // Update status to failed
            report.analysisStatus = 'failed';
            await report.save();

            // Provide fallback response
            const fallbackEnglish = 'Unable to analyze the report automatically. Please consult with a healthcare professional for proper medical interpretation.';
            const fallbackUrdu = 'Report ka automatic analysis nahi ho saka. Sahi medical interpretation ke liye doctor se consult karein.';

            res.status(200).json({
                success: true,
                message: 'Analysis completed with limitations',
                data: {
                    reportId: report._id,
                    aiSummaryEn: fallbackEnglish,
                    aiSummaryUr: fallbackUrdu,
                    analysisStatus: 'failed',
                    note: 'AI analysis failed, showing fallback message'
                }
            });
        }

    } catch (error) {
        console.error('Analyze report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing report',
            error: error.message
        });
    }
};

// Get health insights for user
const getHealthInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get user's recent reports and vitals
        const recentReports = await Report.find({ 
            userId, 
            analysisStatus: 'completed',
            isArchived: false 
        })
        .sort({ createdAt: -1 })
        .limit(5);

        if (recentReports.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No reports available for insights',
                data: {
                    insights: 'Upload and analyze medical reports to get personalized health insights.',
                    recommendations: []
                }
            });
        }

        // Compile summaries for comprehensive insights
        const summaries = recentReports.map(report => 
            `Report from ${report.createdAt.toDateString()}: ${report.aiSummaryEn}`
        ).join('\\n\\n');

        const insightsPrompt = `
            Based on the following medical reports, provide comprehensive health insights and recommendations.
            
            GUIDELINES:
            1. Identify patterns or trends
            2. Provide general wellness recommendations
            3. Suggest lifestyle improvements
            4. Highlight areas that need attention
            5. Keep advice general and non-diagnostic
            6. Limit response to 300 words
            
            Medical Reports Summary:
            ${summaries}
            
            Provide helpful health insights:
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(insightsPrompt);
        const insights = result.response.text();

        res.status(200).json({
            success: true,
            data: {
                insights,
                totalReports: recentReports.length,
                lastAnalyzed: recentReports[0]?.createdAt,
                disclaimer: 'These insights are for informational purposes only and should not replace professional medical advice.'
            }
        });

    } catch (error) {
        console.error('Health insights error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating health insights',
            error: error.message
        });
    }
};

module.exports = {
    analyzeReport,
    getHealthInsights
};
import Resume from "../models/Resume.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResume, generateInterviewQuestions } from "../utils/claudeAnalyzer.js";

// @route POST /api/resume/analyze
export const uploadAndAnalyze = async(req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume PDF" });
        }
        if (!jobDescription || jobDescription.trim().length < 20) {
            return res.status(400).json({ message: "Please provide a valid job description" });
        }

        // Step 1: Extract text from uploaded PDF
        const resumeText = await extractTextFromPDF(req.file.buffer);

        if (!resumeText || resumeText.trim().length < 30) {
            return res.status(400).json({ message: "Could not extract readable text from this PDF" });
        }

        // Step 2: Send to Gemini for analysis
        const analysis = await analyzeResume(resumeText, jobDescription);

        // Step 3: Save to DB
        const resumeRecord = await Resume.create({
            user: req.user._id,
            fileName: req.file.originalname,
            jobDescription,
            matchScore: analysis.matchScore,
            matchedKeywords: analysis.matchedKeywords || [],
            missingKeywords: analysis.missingKeywords || [],
            strengths: analysis.strengths || [],
            suggestions: analysis.suggestions || [],
            summary: analysis.summary || "",
        });

        res.status(201).json(resumeRecord);
    } catch (error) {
        console.error("Analyze error:", error);
        const statusCode = error.isQuotaError ? 429 : 500;
        res.status(statusCode).json({
            message: error.isQuotaError ? error.message : "Failed to analyze resume",
            error: error.message,
        });
    }
};

// @route GET /api/resume/history
export const getHistory = async(req, res) => {
    try {
        const history = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route GET /api/resume/:id
export const getResumeById = async(req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume analysis not found" });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route DELETE /api/resume/:id
export const deleteResume = async(req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume analysis not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    // @route POST /api/resume/interview-questions
    export const getInterviewQuestions = async(req, res) => {
        try {
            const { jobDescription } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: "Please upload a resume PDF" });
            }
            if (!jobDescription || jobDescription.trim().length < 20) {
                return res.status(400).json({ message: "Please provide a valid job description" });
            }

            const resumeText = await extractTextFromPDF(req.file.buffer);

            if (!resumeText || resumeText.trim().length < 30) {
                return res.status(400).json({ message: "Could not extract readable text from this PDF" });
            }

            const questions = await generateInterviewQuestions(resumeText, jobDescription);

            res.status(200).json(questions);
        } catch (error) {
            console.error("Interview questions error:", error);
            const statusCode = error.isQuotaError ? 429 : 500;
            res.status(statusCode).json({
                message: error.isQuotaError ? error.message : "Failed to generate interview questions",
                error: error.message,
            });
        }
    };
};
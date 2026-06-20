import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    matchScore: {
        type: Number,
        required: true,
    },
    matchedKeywords: {
        type: [String],
        default: [],
    },
    missingKeywords: {
        type: [String],
        default: [],
    },
    strengths: {
        type: [String],
        default: [],
    },
    suggestions: {
        type: [String],
        default: [],
    },
    summary: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
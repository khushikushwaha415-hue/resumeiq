import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
    uploadAndAnalyze,
    getHistory,
    getResumeById,
    deleteResume,
    getInterviewQuestions,
} from "../controllers/resumeController.js";

const router = express.Router();

// Store file in memory (we just need the buffer to parse text, not save the file)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

router.post("/analyze", protect, upload.single("resume"), uploadAndAnalyze);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);
router.post("/interview-questions", protect, upload.single("resume"), getInterviewQuestions);

export default router;
import { GoogleGenAI } from "@google/genai";


export const analyzeResume = async(resumeText, jobDescription) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer. Analyze the following resume against the given job description.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Carefully compare the resume to the job description and respond with ONLY a valid JSON object (no markdown formatting, no backticks, no preamble) in exactly this structure:

{
  "matchScore": <number between 0-100 representing how well the resume matches the job description>,
  "matchedKeywords": [<array of important skills/keywords from the JD that ARE present in the resume>],
  "missingKeywords": [<array of important skills/keywords from the JD that are MISSING from the resume>],
  "strengths": [<array of 3-5 strings describing what is strong about this resume for this role>],
  "suggestions": [<array of 4-6 specific, actionable strings suggesting how to improve the resume for this job>],
  "summary": "<a 2-3 sentence overall summary of the candidate's fit for this role>"
}

Be honest and specific. Base the score on actual skill/experience overlap, not just keyword presence. Return ONLY the JSON object.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const rawText = response.text.trim();

    // Strip markdown code fences if Gemini adds them despite instructions
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch (err) {
        throw new Error("Failed to parse AI response as JSON: " + err.message);
    }

    return parsed;
};
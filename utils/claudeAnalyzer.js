import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeResume = async (resumeText, jobDescription) => {
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

  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text.trim();
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      const status = err?.status;
      const isQuotaExceeded = status === 429;
      const isOverloaded = status === 503 || err?.message?.includes("UNAVAILABLE");

      if (isQuotaExceeded) {
        const friendlyError = new Error(
          "Daily AI analysis limit reached for the free tier. Please try again later or tomorrow."
        );
        friendlyError.isQuotaError = true;
        throw friendlyError;
      }

      if (isOverloaded && attempt < maxRetries) {
        const waitTime = attempt * 2000;
        console.log(`Gemini overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
        await sleep(waitTime);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};

export const generateInterviewQuestions = async (resumeText, jobDescription) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are an experienced technical interviewer. Based on the following resume and job description, generate likely interview questions.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Generate a mix of questions tailored specifically to this candidate's background and this role. Respond with ONLY a valid JSON object (no markdown, no backticks) in exactly this structure:

{
  "technicalQuestions": [<array of 4-5 technical questions specific to the skills/technologies mentioned in the resume and job description>],
  "behavioralQuestions": [<array of 3-4 behavioral questions relevant to the role and the candidate's stated experience>],
  "projectQuestions": [<array of 2-3 questions specifically about projects mentioned in the resume, asking the candidate to explain their work>]
}

Make questions specific and realistic — not generic. Reference actual technologies, project names, or experiences mentioned in the resume where relevant. Return ONLY the JSON object.`;

  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text.trim();
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      const status = err?.status;
      const isQuotaExceeded = status === 429;
      const isOverloaded = status === 503 || err?.message?.includes("UNAVAILABLE");

      if (isQuotaExceeded) {
        const friendlyError = new Error(
          "Daily AI analysis limit reached for the free tier. Please try again later or tomorrow."
        );
        friendlyError.isQuotaError = true;
        throw friendlyError;
      }

      if (isOverloaded && attempt < maxRetries) {
        const waitTime = attempt * 2000;
        console.log(`Gemini overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
        await sleep(waitTime);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};
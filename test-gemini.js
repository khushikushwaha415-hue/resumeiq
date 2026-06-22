import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

console.log("Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("Key starts with:", process.env.GEMINI_API_KEY ?.substring(0, 10));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Say hello in one word",
        });
        console.log("SUCCESS:", response.text);
    } catch (error) {
        console.log("FAILED:", error.message);
    }
}

test();
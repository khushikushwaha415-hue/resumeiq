import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const extractTextFromPDF = async(buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        throw new Error("Failed to parse PDF: " + error.message);
    }
};
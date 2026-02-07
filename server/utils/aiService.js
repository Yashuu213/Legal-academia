const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function verifyPaymentScreenshot(filePath, mimeType) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString("base64");

        const prompt = `
      Analyze this image. It is supposed to be a payment screenshot (UPI, GPay, Paytm, PhonePe, etc.).
      
      Extract the following verification details:
      1. Is this a valid payment success screenshot? (true/false)
      2. Amount paid (numeric value).
      3. Transaction ID / UTR (string).
      4. Date and Time (string).
      5. Confidence score (0 to 100) that this is a REAL, UNALTERED screenshot.
      
      Return ONLY a JSON object. No markdown, no valid text. Format:
      {
        "isValid": boolean,
        "amount": number,
        "transactionId": string,
        "date": string,
        "confidence": number,
        "reason": "Short explanation of why it seems valid or fake"
      }
    `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean code fences if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("AI Verification Error:", error);
        return {
            isValid: false,
            confidence: 0,
            reason: "AI Service Error or Invalid Image: " + error.message
        };
    }
}

module.exports = { verifyPaymentScreenshot };

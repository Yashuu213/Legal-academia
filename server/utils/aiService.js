const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Access your API key as an environment variable
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables!");
} else {
    console.log("GEMINI_API_KEY loaded successfully (Ends with: " + process.env.GEMINI_API_KEY.slice(-4) + ")");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function verifyPaymentScreenshot(filePath, mimeType) {
    try {
        // Use Flash model for speed/stability (Pro causing errors)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString("base64");

        const prompt = `
      ROLE: Intelligent Payment Auditor.
      TASK: Verify if the image is a Payment Screenshot.

      GUIDELINES:
      - **Reject Instantly** if the image is clearly NOT a receipt (e.g., logo, selfie, chat, blank).
      - **Approve with Concern** if it looks like a receipt but text is blurry/partial.
      - **Look for KEY Indicators**:
        - "Success" / "Paid" checkmark or text.
        - "Amount" (numbers with currency symbol).
        - "UPI Ref ID" / "UTR" / "Transaction ID".

      SCORING:
      - 90-100: Clean screenshot, clear UTR, Amount, Success.
      - 70-89: Looks valid, but maybe slightly blurry or missing one minor detail.
      - 0-50: Not a payment receipt at all.

      OUTPUT FORMAT (JSON ONLY):
      {
        "isValid": boolean,
        "amount": number (extract best guess),
        "transactionId": string (or "NOT_VISIBLE"),
        "date": string,
        "confidence": number (0-100),
        "reason": "Brief explanation"
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
        console.log("🤖 AI Audit Result:", text); // Debug Log

        // Clean code fences if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("AI Verification Error - Details:", error);

        // --- ERROR FALLBACK (Fail Safe) ---
        console.log("⚠️ AI Verification Failed (API Error). Defaulting to MANUAL CHECK. ⚠️");
        return {
            isValid: false,
            amount: 0,
            transactionId: "MANUAL-CHECK-REQUIRED",
            date: new Date().toISOString(),
            confidence: 0,
            reason: "AI Service Unavailable (API Error). Please verify manually."
        };
        // ---------------------------------------------
    }
}

module.exports = { verifyPaymentScreenshot };

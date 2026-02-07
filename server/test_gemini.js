require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini API...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ No API Key found in .env");
        return;
    }
    console.log(`✅ API Key loaded: ...${apiKey.slice(-4)}`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        // const prompt = "Explain how AI works in one sentence.";
        // console.log(`Sending prompt: "${prompt}"`);
        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        // const text = response.text();

        // New Test: List Models
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy
        console.log("Attempting to generate with gemini-pro...");
        const result = await model.generateContent("Test");
        console.log("Success:", result.response.text());

    } catch (error) {
        console.error("❌ API Test Failed:");
        console.error(error);
    }
}

testGemini();

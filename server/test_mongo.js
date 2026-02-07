require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

console.log("Testing MongoDB Connection...");
console.log("URI (First 20 chars):", uri ? uri.substring(0, 30) + "..." : "undefined");

if (!uri) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection Failed:");
        console.error("CodeName:", err.codeName);
        console.error("Code:", err.code);
        console.error("Message:", err.message); // This might contain the bad auth message
        process.exit(1);
    });

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/review', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code || !code.trim()) {
            return res.status(400).json({ error: "Source code cannot be empty." });
        }

        const prompt = `You are an expert full-stack code reviewer. Review the following code for bugs, performance issues, and security vulnerabilities. Suggest clean, optimized fixes:\n\n${code}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ review: response.text });
    } catch (error) {
        console.error("Error processing code review:", error.message);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server successfully running on http://localhost:${PORT}`);
});
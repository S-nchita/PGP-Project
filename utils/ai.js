const GEMINI_API_KEY = "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Centralized Gemini API caller with JSON extraction logic
 * @param {string} prompt 
 * @returns {Promise<any>} Parsed JSON response
 */
async function callGemini(prompt) {
    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            throw new Error("Invalid response structure from Gemini");
        }

        const rawResponse = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        let jsonString = rawResponse;
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            jsonString = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
        }
        
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini AI Utility Error:", error.message);
        throw error;
    }
}

module.exports = { callGemini };

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeClaim(text) {
  try {
    const prompt = `You are an insurance claim analysis assistant.
Extract the following from the given claim document:
1. Claim Reason
2. Coverage Summary
3. Final concise summary

Return response in STRICT JSON format:
{
  "claim_reason": "",
  "coverage_summary": "",
  "summary": ""
}

Claim Document text:
${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    
    // Attempt to parse the JSON output from the LLM
    let resultText = response.text;
    // Strip markdown code blocks if the LLM wrapped the response
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const parsedJson = JSON.parse(resultText);
    return parsedJson;

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw error;
  }
}

module.exports = {
  analyzeClaim
};

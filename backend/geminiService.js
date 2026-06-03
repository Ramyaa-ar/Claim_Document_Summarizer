const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeClaim(text) {
  try {
    const prompt = `You are an insurance claim analysis assistant.
Extract the following from the given claim document:

1. Smart Claim Heading: Generate a short professional heading/title for the claim (e.g., "Highway Bike Accident").
2. Claim Type Detection: Detect the category of claim. Possible values: Medical, Vehicle, Theft, Accident, Corporate, Travel, Property, Other.
3. Preview Text: Generate a short one-line preview suitable for history cards.
4. Claim Reason: A detailed explanation of why the claim is being made.
5. Coverage Summary: A summary of the policy coverage and deductibles.
6. Final concise summary: Generate concise but professional summaries that are easy for non-technical users to understand.

Return response in STRICT JSON format:
{
  "heading": "",
  "claim_type": "",
  "preview": "",
  "claim_reason": "",
  "coverage_summary": "",
  "summary": ""
}

Ensure response is valid parsable JSON. No markdown formatting. No extra explanation text.

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

    try {
      const parsedJson = JSON.parse(resultText);
      return parsedJson;
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Raw text was:", resultText);
      // Fallback
      return {
        heading: "Analysis Completed",
        claim_type: "Other",
        preview: "AI generated a response but structured parsing failed.",
        claim_reason: "Parsed data unavailable",
        coverage_summary: "Parsed data unavailable",
        summary: resultText
      };
    }

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw error;
  }
}

module.exports = {
  analyzeClaim
};

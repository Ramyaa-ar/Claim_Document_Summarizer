const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeClaim(text) {
  try {
    const prompt = `You are an advanced insurance claim analysis assistant.

Analyze the provided insurance claim document carefully and extract meaningful structured insights.

IMPORTANT INSTRUCTIONS:
- Understand the context semantically
- Identify policy risks, exclusions, waiting periods, and reimbursement issues
- Avoid repeating the same information across sections
- Keep each section focused and distinct
- Generate professional insurance-style analysis
- Return STRICT VALID JSON ONLY
- Do not include markdown
- Do not include explanation text outside JSON

Extract the following:
1. Smart Claim Heading: Generate a short professional heading describing the claim event itself, not just the person's name.
2. Claim Type: Possible values: Medical, Vehicle, Theft, Accident, Corporate, Travel, Property, Other.
3. Preview Text: Generate a short one-line preview suitable for history cards.
4. Claim Reason: Clearly explain why the claim was raised.
5. Coverage Summary: Explain what is covered, what may not be covered, policy conditions, and reimbursement limitations.
6. Final Summary: Generate a concise but professional summary for non-technical users.

Return STRICT JSON ONLY in this exact format:
{
  "heading": "",
  "claim_type": "",
  "preview": "",
  "claim_reason": "",
  "coverage_summary": "",
  "summary": ""
}

Claim Document:
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

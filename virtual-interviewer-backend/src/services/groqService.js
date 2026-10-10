const Groq = require("groq-sdk");


const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


async function getCareerRecommendation(userInput) {
  try {
    const prompt = `
You are an AI Career Advisor.

Return ONLY JSON in this exact format:

{
  "bestCareer": "string",
  "score": number,
  "reason": "string",
  "alternatives": [
    {
      "career": "string",
      "score": number,
      "reason": "string"
    }
  ]
}

Student Skills:
${userInput}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",   // ✅ WORKING MODEL
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq AI Error:", error.message);
    throw new Error("Groq AI Failed");
  }
}

module.exports = { getCareerRecommendation };

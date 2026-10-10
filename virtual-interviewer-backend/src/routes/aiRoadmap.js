const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/ai-roadmap", async (req, res) => {
  const { skills } = req.body;

  const prompt = `
Generate roadmap JSON ONLY.
User skills: ${skills}
Format:
[
 { "phase": "Phase 1", "topics": ["Topic1","Topic2"] }
]
Return ONLY JSON.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message.content;

    const aiData = JSON.parse(content);

    const formatted = aiData.map(p => ({
      phase: p.phase,
      topics: p.topics.map(t => ({ name: t, done: false }))
    }));

    res.json(formatted);

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;

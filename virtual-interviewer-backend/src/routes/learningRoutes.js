const express = require("express");
const router = express.Router();
const axios = require("axios");

// AI Explain API
router.post("/explain", async (req, res) => {
  try {
    const { topic, content } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Explain coding topics simply like a tutor." },
          { role: "user", content: `Explain this topic: ${topic}\n\n${content}` }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ explanation: response.data.choices[0].message.content });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;

const { getCareerRecommendation } = require("../services/groqService");

exports.askCareerAdvisor = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getCareerRecommendation(message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Groq AI failed" });
  }
};
